import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    console.log('Starting Semantic Scene Scan...');

    // Call cjwbw/semantic-segment-anything
    const output: any = await replicate.run(
      "cjwbw/semantic-segment-anything:b2691db53f2d96add0051a4a98e7a3861bd21bf5972031119d344d956d2f8256",
      {
        input: {
          image: image
        }
      }
    );

    // The model returns:
    // {
    //   img_out: "https://...",
    //   json_out: "https://..."
    // }
    
    // We need to fetch the JSON content to send it to the frontend for interaction
    const jsonResponse = await fetch(output.json_out);
    const segmentationData = await jsonResponse.json();

    return NextResponse.json({ 
      success: true, 
      mapUrl: output.img_out,
      segments: segmentationData,
      feedback: "Scene analysis complete. Click any highlighted object to paint."
    });

  } catch (error: any) {
    console.error('Scene Scan Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
