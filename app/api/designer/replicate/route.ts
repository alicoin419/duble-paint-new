import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import sharp from 'sharp';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image, polygon, obstructions, colorName, colorHex } = await req.json();

    if (!image || !polygon) {
      return NextResponse.json({ error: 'Missing image or polygon' }, { status: 400 });
    }

    // 1. Process the base64 image
    const base64Data = image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const metadata = await sharp(imageBuffer).metadata();
    const { width, height } = metadata;

    if (!width || !height) throw new Error('Could not get image dimensions');

    // 2. Create the Mask using Sharp
    // SVG path for the main polygon
    const points = polygon.map((p: any) => `${p.x * width},${p.y * height}`).join(' ');
    let svgMask = `
      <svg width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="black" />
        <polygon points="${points}" fill="white" />
    `;

    // Subtract obstructions
    if (obstructions && obstructions.length > 0) {
      obstructions.forEach((obs: any) => {
        const obsPoints = obs.map((p: any) => `${p.x * width},${p.y * height}`).join(' ');
        svgMask += `<polygon points="${obsPoints}" fill="black" />`;
      });
    }

    svgMask += `</svg>`;

    const maskBuffer = await sharp(Buffer.from(svgMask))
      .png()
      .toBuffer();

    const maskBase64 = `data:image/png;base64,${maskBuffer.toString('base64')}`;

    // 3. Call Replicate SDXL Inpainting
    // Model: stability-ai/sdxl-inpainting
    const prompt = `A room with the ${colorName} painted surface. The finish is a luxury architectural coating by Double Design Paints. High quality, realistic interior photography, perfect lighting. The color hex is ${colorHex}.`;

    const output = await replicate.run(
      "lucataco/sdxl-inpainting:a5b13068cc81a89a4fbeefeccc774869fcb34df4dbc92c1555e0f2771d49dde7",
      {
        input: {
          image: image,
          mask: maskBase64,
          prompt: prompt,
          negative_prompt: "deformed, messy, blurry, low quality, artifacts, distorted architecture",
          steps: 25,
          guidance_scale: 7.5,
          strength: 0.8,
        }
      }
    );

    // Replicate returns an array of URLs for this model
    const resultImage = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ 
      success: true, 
      image: resultImage,
      feedback: `Photorealistic preview generated using SDXL Inpainting with ${colorName} finish.`
    });

  } catch (error: any) {
    console.error('High-Fidelity API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
