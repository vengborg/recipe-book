import { NextRequest, NextResponse } from 'next/server';
import { scrapeRecipe } from '@/lib/scraper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const recipe = await scrapeRecipe(url);
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Scrape error:', error);
    const message = error instanceof Error ? error.message : 'Failed to scrape recipe';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
