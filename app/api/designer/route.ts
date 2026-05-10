import { NextResponse } from 'next/server';

// Simple in-memory rate limiting map for demonstration (IP -> { count, resetTime })
// For production, use Upstash Redis or similar distributed cache.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // Allow 5 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > limitData.resetTime) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (limitData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  limitData.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'anonymous-ip';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Rate limit exceeded.' }, { status: 429 });
    }

    const body = await req.json();
    const { image, objectType, colorName } = body;

    if (!image || !objectType || !colorName) {
      return NextResponse.json({ error: 'Missing required fields: image, objectType, colorName' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Parse base64 string
    // Format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid image format. Expected base64 data URI.' }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // 2. Prepare payload for Gemini API
    // We use gemini-1.5-pro for best vision capabilities and validation
    const prompt = `
You are an expert interior designer and architectural space analyzer.
I am providing you with an image of a space. The user wants to apply the paint finish '${colorName}' to the '${objectType}' in this room.
Analyze the image and respond with a JSON object with two fields:
1. "isValidated": boolean. True if you can clearly identify the ${objectType} in the image and it makes sense to paint it. False otherwise.
2. "feedback": string. A brief, professional assessment (max 3 sentences) explaining where you found the ${objectType}, the lighting conditions, and how the ${colorName} finish might interact with the space's architecture. If not validated, explain why.

Do not include markdown blocks like \`\`\`json, just return the raw JSON.
`;

    // 3. Token Management and Request Configuration
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2, // Low temperature for consistent JSON
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 2048, // Increased to allow room for thinking + response
        response_mime_type: "application/json",
      }
    };

    // Call Gemini REST API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Failed to process image with AI' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    // Find the first part that actually contains text
    const aiText = data.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text;

    if (!aiText) {
      throw new Error('No valid response from Gemini API');
    }

    let result;
    try {
      result = JSON.parse(aiText.trim());
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", aiText);
      // Fallback if model doesn't return perfect JSON
      result = {
        isValidated: true,
        feedback: "The AI processed your request but returned an unexpected format. Applying standard visualizer."
      };
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Designer API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
