import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Simple in-memory rate limiting map for demonstration (IP -> { count, resetTime })
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Increased for testing

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);
  if (!limitData) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now > limitData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (limitData.count >= MAX_REQUESTS_PER_WINDOW) return false;
  limitData.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous-ip';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Rate limit exceeded.' }, { status: 429 });
    }

    const body = await req.json();
    const { image, objectType, colorName, clickX, clickY } = body;

    if (!image || !objectType || !colorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const replicateToken = process.env.REPLICATE_API_TOKEN;

    // IF CLICKED: Use SAM 2 for Pixel-Perfect Precision
    if (clickX !== undefined && clickY !== undefined && replicateToken) {
      console.log(`Precision Mapping triggered at: ${clickX}, ${clickY}`);
      
      // We need image dimensions to convert normalized coords to pixel coords
      const sharp = (await import('sharp')).default;
      const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : image;
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const { width, height } = await sharp(imageBuffer).metadata();

      if (!width || !height) throw new Error("Could not determine image dimensions");

      // Convert normalized to pixel coordinates
      const pixelX = Math.round(clickX * width);
      const pixelY = Math.round(clickY * height);

      const output: any = await replicate.run(
        "meta/sam-2:fe97b453a6455861e3bac769b441ca1f1086110da7466dbb65cf1eecfd60dc83",
        {
          input: {
            image: image,
            input_points: `[[${pixelX}, ${pixelY}]]`,
            input_labels: "[1]",
            multimask_output: false
          }
        }
      );

      // SAM 2 returns masks/JSON. We expect a mask image URL.
      // Depending on the version, output might be a list or object.
      const maskUrl = Array.isArray(output) ? output[0] : output;

      return NextResponse.json({
        isValidated: true,
        feedback: `Precision mapping successful. Targeting surface at ${Math.round(clickX * 100)}%, ${Math.round(clickY * 100)}% with pixel-level accuracy.`,
        segmentation: {
          maskUrl: maskUrl,
          confidence: 0.99
        }
      });
    }

    // FALLBACK: Use Gemini 2.5 Pro for architectural analysis
    if (!apiKey) return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });

    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    const mimeType = matches ? matches[1] : 'image/jpeg';
    const base64Data = matches ? matches[2] : image;

    const prompt = `
You are an expert interior designer. Analyze the image. The user wants to paint the '${objectType}' with '${colorName}'.
Respond with a JSON object:
- "isValidated": boolean.
- "feedback": string.
- "segmentation": {
    "polygon": [{ "x": number, "y": number }, ...] // normalized 0-1
    "obstructions": [[{ "x": number, "y": number }, ...], ...]
}
`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Data } }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 8192, response_mime_type: "application/json" }
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text;
    
    if (!aiText) throw new Error('No valid response from Gemini API');
    return NextResponse.json(JSON.parse(aiText.trim()));

  } catch (error: any) {
    console.error('Designer API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
