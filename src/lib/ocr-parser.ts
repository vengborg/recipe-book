/**
 * Parse raw OCR text from a recipe screenshot into structured recipe fields.
 *
 * This is heuristic-based — it looks for common patterns like ingredient
 * quantities, section headers, and time/serving callouts. Good enough for
 * most cookbook screenshots and Instagram recipe cards. Users review and
 * correct before saving.
 */

import { emptyNutrition } from './nutrition';
import { detectProtein, detectMethod } from './scraper';
import type { ScrapedRecipe } from './types';

// Patterns that mark the start of an ingredients section
const INGREDIENT_HEADERS = /^(ingredients|what you.?ll need|you.?ll need|shopping list)\s*:?\s*$/i;

// Patterns that mark the start of an instructions section
const INSTRUCTION_HEADERS =
  /^(instructions|directions|method|steps|preparation|how to make|how to cook|procedure)\s*:?\s*$/i;

// Lines that look like ingredients (start with a number/fraction, or common units)
const INGREDIENT_LINE =
  /^(\d|½|⅓|⅔|¼|¾|⅛|⅜|⅝|⅞|one|two|three|four|five|six|a\s|pinch|dash|handful|bunch)/i;

// Lines that look like numbered steps
const NUMBERED_STEP = /^\s*(?:step\s*)?\d+[\.\)\:]?\s+/i;

// Time patterns
const TIME_PATTERN =
  /(?:(?:cook|bake|roast|grill|simmer|fry|prep|total)\s*(?:time)?\s*:?\s*)(\d+\s*(?:min(?:ute)?s?|hrs?|hours?))/gi;

// Serving patterns
const SERVING_PATTERN =
  /(?:serves?|servings?|yield|makes|portions?)\s*:?\s*(\d+(?:\s*-\s*\d+)?)/i;

// Calorie patterns
const CALORIE_PATTERN = /(\d+)\s*(?:kcal|calories?|cals?)/i;

/**
 * Split raw OCR text into structured recipe data.
 */
export function parseOcrText(raw: string): ScrapedRecipe {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return emptyResult();
  }

  // --- Extract metadata from entire text first ---
  const fullText = lines.join(' ');

  // Servings
  const servingsMatch = fullText.match(SERVING_PATTERN);
  const servings = servingsMatch ? servingsMatch[1] : '';

  // Times
  let cookTime = '';
  let prepTime = '';
  let totalMinutes: number | null = null;
  const timeMatches = [...fullText.matchAll(TIME_PATTERN)];
  for (const m of timeMatches) {
    const timeStr = m[1];
    const context = m[0].toLowerCase();
    if (context.includes('prep')) {
      prepTime = timeStr;
    } else if (context.includes('total')) {
      // parse total
      const mins = parseTimeToMinutes(timeStr);
      if (mins) totalMinutes = mins;
    } else {
      cookTime = timeStr;
    }
  }
  if (!totalMinutes) {
    const cookMins = parseTimeToMinutes(cookTime);
    const prepMins = parseTimeToMinutes(prepTime);
    if (cookMins || prepMins) {
      totalMinutes = (cookMins || 0) + (prepMins || 0);
    }
  }

  // Calories (basic)
  const calMatch = fullText.match(CALORIE_PATTERN);
  const nutrition = emptyNutrition();
  if (calMatch) {
    nutrition.calories = parseInt(calMatch[1], 10);
  }

  // --- Section-based parsing ---
  let mode: 'title' | 'ingredients' | 'instructions' | 'unknown' = 'title';
  let title = '';
  const description = '';
  const ingredients: string[] = [];
  const instructions: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for section headers
    if (INGREDIENT_HEADERS.test(line)) {
      mode = 'ingredients';
      continue;
    }
    if (INSTRUCTION_HEADERS.test(line)) {
      mode = 'instructions';
      continue;
    }

    if (mode === 'title') {
      // First substantial line is likely the title
      if (!title && line.length > 2 && !TIME_PATTERN.test(line) && !SERVING_PATTERN.test(line)) {
        title = line;
        mode = 'unknown';
      }
      continue;
    }

    if (mode === 'ingredients') {
      // Stay in ingredient mode until we hit an instruction header or a numbered step pattern
      if (NUMBERED_STEP.test(line) && ingredients.length > 0) {
        mode = 'instructions';
        instructions.push(line.replace(NUMBERED_STEP, '').trim());
        continue;
      }
      ingredients.push(cleanIngredientLine(line));
      continue;
    }

    if (mode === 'instructions') {
      instructions.push(line.replace(NUMBERED_STEP, '').trim());
      continue;
    }

    // Unknown mode — try to figure out what this line is
    if (INGREDIENT_LINE.test(line)) {
      mode = 'ingredients';
      ingredients.push(cleanIngredientLine(line));
    } else if (NUMBERED_STEP.test(line)) {
      mode = 'instructions';
      instructions.push(line.replace(NUMBERED_STEP, '').trim());
    }
    // else skip — probably description or metadata we already extracted
  }

  const proteinType = detectProtein(ingredients);
  const cookingMethod = detectMethod(instructions, title);

  return {
    title,
    description,
    ingredients: ingredients.filter(Boolean),
    instructions: instructions.filter(Boolean),
    photoUrl: '',
    servings,
    cookTime,
    prepTime,
    totalTimeMinutes: totalMinutes,
    sourceUrl: '',
    videoUrl: '',
    nutrition,
    proteinType,
    cookingMethod,
  };
}

function cleanIngredientLine(line: string): string {
  // Remove bullet points, dashes, checkboxes at the start
  return line.replace(/^[\-•●○◦▪▸►–—\[\]✓✗xX]\s*/, '').trim();
}

function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const hourMatch = timeStr.match(/(\d+)\s*(?:hrs?|hours?)/i);
  const minMatch = timeStr.match(/(\d+)\s*(?:min(?:ute)?s?)/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) total += parseInt(minMatch[1], 10);
  return total > 0 ? total : null;
}

function emptyResult(): ScrapedRecipe {
  return {
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    photoUrl: '',
    servings: '',
    cookTime: '',
    prepTime: '',
    totalTimeMinutes: null,
    sourceUrl: '',
    videoUrl: '',
    nutrition: emptyNutrition(),
    proteinType: 'none',
    cookingMethod: 'other',
  };
}
