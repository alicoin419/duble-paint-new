import { NextResponse } from 'next/server';
import { z } from 'zod';

// ─── Request Schema (Zod) ─────────────────────────────────────────────────────

const RequestSchema = z.object({
  image: z
    .string()
    .min(100, 'Image data too short')
    .refine((v) => v.startsWith('data:image/'), 'Must be a base64 data URI'),
  objectType: z.string().min(1).max(50),
  colorName:  z.string().min(1).max(80),
  clickX: z.number().min(0).max(1).optional(),
  clickY: z.number().min(0).max(1).optional(),
});

// ─── Rate Limiting ────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS  = 60_000;

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'anonymous'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetIn: entry.resetTime - now };
}

// ─── Gemini Call ──────────────────────────────────────────────────────────────

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

async function callGemini(
  apiKey: string,
  mimeType: string,
  base64Data: string,
  clickX?: number,
  clickY?: number,
): Promise<{ polygon: Array<{ x: number; y: number }>; obstructions: Array<Array<{ x: number; y: number }>>; feedback: string }> {
  const clickHint =
    clickX !== undefined && clickY !== undefined
      ? `The user clicked at normalized position x=${clickX.toFixed(3)}, y=${clickY.toFixed(3)} (0,0=top-left, 1,1=bottom-right). Segment ONLY the single continuous paintable surface at that exact pixel. Do NOT segment the entire room.`
      : 'Segment the most prominent paintable surface in the image.';

  const prompt = `You are a precision architectural surface segmentation AI for a luxury paint brand.

TASK: ${clickHint}

STRICT RULES:
1. Return ONLY the surface the user clicked — NOT the whole room, NOT adjacent surfaces.
2. The polygon must be TIGHT — hug the actual visible edges of the surface.
3. Use 24–48 polygon points for smooth, accurate outlines.
4. Exclude physical obstructions (windows, doors, furniture touching the surface) as "obstructions" holes.
5. All coordinates are normalized 0.0–1.0 (x = left→right, y = top→bottom).
6. If no valid paintable surface is found at the click point, return isValidated: false.

Return ONLY a single valid JSON object (no markdown fences, no explanation):
{
  "isValidated": true,
  "feedback": "One precise sentence describing the identified surface.",
  "segmentation": {
    "polygon": [{"x": 0.0, "y": 0.0}],
    "obstructions": [[{"x": 0.0, "y": 0.0}]]
  }
}`;

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Data } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.05,
        maxOutputTokens: 8192,
        response_mime_type: 'application/json',
      },
    }),
  });

  if (res.status === 429) {
    throw Object.assign(new Error('Gemini quota exceeded. Please try again in a moment.'), { code: 'QUOTA' });
  }
  if (!res.ok) {
    throw Object.assign(new Error(`Gemini API error ${res.status}`), { code: 'GEMINI_ERROR' });
  }

  const geminiData = await res.json();
  const rawText = geminiData.candidates?.[0]?.content?.parts?.find((p: { text?: string }) => p.text)?.text;
  if (!rawText) {
    const blockReason = geminiData.promptFeedback?.blockReason;
    if (blockReason) throw Object.assign(new Error(`Image blocked by safety filter: ${blockReason}`), { code: 'BLOCKED' });
    throw Object.assign(new Error('No response from Gemini'), { code: 'EMPTY_RESPONSE' });
  }

  const cleaned = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.isValidated) {
    throw Object.assign(
      new Error(parsed.feedback ?? 'AI could not identify a paintable surface at that point.'),
      { code: 'NOT_VALIDATED' },
    );
  }
  if (!Array.isArray(parsed.segmentation?.polygon) || parsed.segmentation.polygon.length < 3) {
    throw Object.assign(new Error('AI returned an invalid polygon. Please click closer to the surface centre.'), { code: 'INVALID_POLYGON' });
  }

  return {
    polygon: parsed.segmentation.polygon,
    obstructions: parsed.segmentation.obstructions ?? [],
    feedback: parsed.feedback ?? '',
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const baseHeaders = {
    'x-ddp-request-id': requestId,
    'Content-Security-Policy': "default-src 'none'",
  };

  // 1. Rate limit
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.', code: 'RATE_LIMITED' },
      {
        status: 429,
        headers: {
          ...baseHeaders,
          'Retry-After': String(Math.ceil(rateCheck.resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  // 2. Parse & validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.', code: 'INVALID_JSON' },
      { status: 400, headers: baseHeaders },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request.', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
      { status: 400, headers: baseHeaders },
    );
  }

  const { image, objectType: _objectType, colorName: _colorName, clickX, clickY } = parsed.data;

  // 3. Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI service not configured.', code: 'NO_API_KEY' },
      { status: 503, headers: baseHeaders },
    );
  }

  // 4. Extract base64 parts
  const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    return NextResponse.json(
      { error: 'Malformed image data URI.', code: 'BAD_IMAGE' },
      { status: 400, headers: baseHeaders },
    );
  }
  const mimeType  = matches[1];
  const base64Data = matches[2];

  // 5. Call Gemini
  try {
    const result = await callGemini(apiKey, mimeType, base64Data, clickX, clickY);
    return NextResponse.json(
      {
        isValidated: true,
        feedback: result.feedback,
        segmentation: {
          polygon: result.polygon,
          obstructions: result.obstructions,
          confidence: 1,
        },
      },
      { status: 200, headers: { ...baseHeaders, 'X-RateLimit-Remaining': String(rateCheck.remaining) } },
    );
  } catch (err: unknown) {
    const e = err as Error & { code?: string };
    const isUserError = ['NOT_VALIDATED', 'INVALID_POLYGON', 'BLOCKED'].includes(e.code ?? '');
    const isQuota     = e.code === 'QUOTA';
    console.error(`[designer-api] requestId=${requestId} code=${e.code} message=${e.message}`);
    return NextResponse.json(
      { error: e.message, code: e.code ?? 'INTERNAL_ERROR' },
      {
        status: isUserError ? 422 : isQuota ? 503 : 500,
        headers: baseHeaders,
      },
    );
  }
}
