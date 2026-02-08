import * as cheerio from 'cheerio';
import {
  ScrapedRecipe,
  Nutrition,
  ProteinType,
  CookingMethod,
} from './types';
import { parseNutritionValue, emptyNutrition } from './nutrition';

/**
 * Parse an ISO 8601 duration (e.g., PT30M, PT1H15M) to minutes.
 */
function parseDuration(duration: string | undefined | null): number | null {
  if (!duration) return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

/**
 * Extract video URL from JSON-LD or page HTML.
 */
function extractVideo($: cheerio.CheerioAPI, jsonLd: Record<string, unknown> | null): string {
  // Check JSON-LD video property
  if (jsonLd) {
    const video = jsonLd.video as Record<string, unknown> | Record<string, unknown>[] | undefined;
    if (video) {
      const v = Array.isArray(video) ? video[0] : video;
      if (v) {
        const embedUrl = (v.embedUrl || v.contentUrl || v.url) as string | undefined;
        if (embedUrl) return embedUrl;
      }
    }
  }

  // Look for YouTube / Vimeo iframes
  const iframeSrc = $('iframe[src*="youtube.com"], iframe[src*="youtu.be"], iframe[src*="vimeo.com"]').first().attr('src');
  if (iframeSrc) return iframeSrc;

  // Look for YouTube links in the page
  const ytLink = $('a[href*="youtube.com/watch"], a[href*="youtu.be/"]').first().attr('href');
  if (ytLink) return ytLink;

  return '';
}

/**
 * Parse instructions from JSON-LD, which can be an array of strings or HowToStep objects.
 */
function parseInstructions(raw: unknown): string[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) {
    if (typeof raw === 'string') {
      return raw.split(/\n+/).map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  }

  const results: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      results.push(item.trim());
    } else if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      if (obj['@type'] === 'HowToSection' && Array.isArray(obj.itemListElement)) {
        for (const subItem of obj.itemListElement as Record<string, unknown>[]) {
          if (typeof subItem.text === 'string') results.push(subItem.text.trim());
        }
      } else if (typeof obj.text === 'string') {
        results.push(obj.text.trim());
      } else if (typeof obj.name === 'string') {
        results.push(obj.name.trim());
      }
    }
  }
  return results.filter(Boolean);
}

/**
 * Extract nutrition from JSON-LD.
 */
function parseNutrition(raw: unknown): Nutrition {
  if (!raw || typeof raw !== 'object') return emptyNutrition();
  const n = raw as Record<string, unknown>;
  return {
    calories: parseNutritionValue(n.calories as string | undefined),
    protein: parseNutritionValue(n.proteinContent as string | undefined),
    carbs: parseNutritionValue(n.carbohydrateContent as string | undefined),
    fat: parseNutritionValue(n.fatContent as string | undefined),
    perServing: true,
  };
}

/**
 * Auto-detect protein type from ingredients list.
 */
export function detectProtein(ingredients: string[]): ProteinType {
  const text = ingredients.join(' ').toLowerCase();
  if (/\bchicken\b/.test(text)) return 'chicken';
  if (/\bbeef\b|\bsteak\b|\bribs\b|\bbrisket\b|\bsirloin\b|\bribeye\b/.test(text)) return 'beef';
  if (/\bpork\b|\bbacon\b|\bham\b|\bsausage\b/.test(text)) return 'pork';
  if (/\bsalmon\b|\btuna\b|\bcod\b|\btilapia\b|\bhalibut\b|\btrout\b|\bfish\b/.test(text)) return 'fish';
  if (/\bshrimp\b|\blobster\b|\bcrab\b|\bscallop\b|\bseafood\b|\bclam\b|\bmussel\b/.test(text)) return 'seafood';
  if (/\btofu\b|\btempeh\b|\bseitan\b|\bplant.?based\b/.test(text)) return 'tofu';
  if (/\beggs?\b/.test(text) && !/\begg wash\b|\begg whites?\s+for/.test(text)) return 'eggs';
  return 'none';
}

/**
 * Auto-detect cooking method from instructions.
 */
export function detectMethod(instructions: string[], title: string = ''): CookingMethod {
  const text = (instructions.join(' ') + ' ' + title).toLowerCase();
  if (/\bair\s*fryer\b|\bair.?fry\b/.test(text)) return 'air-fryer';
  if (/\bslow\s*cooker\b|\bcrock\s*pot\b/.test(text)) return 'slow-cooker';
  if (/\binstant\s*pot\b|\bpressure\s*cook\b/.test(text)) return 'instant-pot';
  if (/\bgrill\b|\bgrilled\b|\bgrilling\b|\bbbq\b|\bbarbecue\b/.test(text)) return 'grill';
  if (/\boven\b|\bbake\b|\bbroil\b|\broast\b/.test(text)) return 'oven';
  if (/\bskillet\b|\bsauté\b|\bsaute\b|\bpan\b|\bwok\b|\bsimmer\b|\bboil\b|\bstovetop\b|\bstove\b|\bfry\b/.test(text)) return 'stovetop';
  if (/\bno.?cook\b|\braw\b|\bassembl/.test(text)) return 'no-cook';
  return 'other';
}

/**
 * Scrape a recipe from a URL by parsing JSON-LD structured data.
 */
export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Find JSON-LD recipe data
  let recipeData: Record<string, unknown> | null = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html() || '');
      // Handle @graph arrays
      const items = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const item of items) {
        if (
          item['@type'] === 'Recipe' ||
          (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))
        ) {
          recipeData = item;
          break;
        }
      }
    } catch {
      // Skip malformed JSON-LD
    }
  });

  if (recipeData) {
    const rd = recipeData as Record<string, unknown>;
    const ingredients = Array.isArray(rd.recipeIngredient)
      ? (rd.recipeIngredient as string[])
      : [];
    const instructions = parseInstructions(rd.recipeInstructions);

    const prepMinutes = parseDuration(rd.prepTime as string | undefined);
    const cookMinutes = parseDuration(rd.cookTime as string | undefined);
    const totalMinutes =
      parseDuration(rd.totalTime as string | undefined) ||
      (prepMinutes || 0) + (cookMinutes || 0) ||
      null;

    // Image handling
    let photoUrl = '';
    if (rd.image) {
      if (typeof rd.image === 'string') {
        photoUrl = rd.image;
      } else if (Array.isArray(rd.image)) {
        photoUrl = typeof rd.image[0] === 'string' ? rd.image[0] : (rd.image[0] as Record<string, unknown>)?.url as string || '';
      } else if (typeof rd.image === 'object') {
        photoUrl = (rd.image as Record<string, unknown>).url as string || '';
      }
    }

    return {
      title: (rd.name as string) || '',
      description: (rd.description as string) || '',
      ingredients,
      instructions,
      photoUrl,
      servings: String(rd.recipeYield || rd.yield || ''),
      cookTime: formatDuration(cookMinutes),
      prepTime: formatDuration(prepMinutes),
      totalTimeMinutes: totalMinutes,
      sourceUrl: url,
      videoUrl: extractVideo($, recipeData),
      nutrition: parseNutrition(rd.nutrition),
      proteinType: detectProtein(ingredients),
      cookingMethod: detectMethod(instructions, (rd.name as string) || ''),
    };
  }

  // Fallback: basic meta tag scraping
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').text() ||
    '';
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';
  const photoUrl =
    $('meta[property="og:image"]').attr('content') || '';

  return {
    title,
    description,
    ingredients: [],
    instructions: [],
    photoUrl,
    servings: '',
    cookTime: '',
    prepTime: '',
    totalTimeMinutes: null,
    sourceUrl: url,
    videoUrl: extractVideo($, null),
    nutrition: emptyNutrition(),
    proteinType: 'none',
    cookingMethod: 'other',
  };
}
