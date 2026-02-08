import { NextRequest, NextResponse } from 'next/server';
import { parseOcrText } from '@/lib/ocr-parser';

/**
 * POST /api/parse-image
 *
 * Accepts raw OCR text (extracted client-side via Tesseract.js) and returns
 * structured recipe data.
 *
 * --- Future AI vision upgrade ---
 * To use an AI vision API (OpenAI, Claude, etc.) instead of client-side OCR:
 *   1. Accept the image as base64 or multipart form data
 *   2. Send it to the vision API with a recipe-extraction prompt
 *   3. Parse the AI response into the ScrapedRecipe shape
 *   4. Set RECIPE_VISION_API_KEY in env and uncomment the block below
 *
 * For now this route just parses OCR text — the heavy lifting (Tesseract)
 * runs client-side so there's no server-side binary dependency.
 */

// ----- Future: AI Vision API integration -----
// const VISION_API_KEY = process.env.RECIPE_VISION_API_KEY;
//
// async function extractWithVisionAI(imageBase64: string) {
//   // Example with OpenAI GPT-4 Vision:
//   // const res = await fetch('https://api.openai.com/v1/chat/completions', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     Authorization: `Bearer ${VISION_API_KEY}`,
//   //   },
//   //   body: JSON.stringify({
//   //     model: 'gpt-4o',
//   //     messages: [{
//   //       role: 'user',
//   //       content: [
//   //         { type: 'text', text: 'Extract the recipe from this image. Return JSON with: title, description, ingredients (array), instructions (array), servings, cookTime, prepTime. Be precise.' },
//   //         { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
//   //       ],
//   //     }],
//   //   }),
//   // });
//   // return res.json();
// }
// -------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ocrText } = body;

    if (!ocrText || typeof ocrText !== 'string') {
      return NextResponse.json(
        { error: 'ocrText is required — send the extracted text from Tesseract.js' },
        { status: 400 }
      );
    }

    const recipe = parseOcrText(ocrText);

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Parse-image error:', error);
    const message = error instanceof Error ? error.message : 'Failed to parse recipe text';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
