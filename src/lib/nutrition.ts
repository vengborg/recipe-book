import { Nutrition } from './types';

export function emptyNutrition(): Nutrition {
  return {
    calories: null,
    protein: null,
    carbs: null,
    fat: null,
    perServing: true,
  };
}

export function hasNutrition(n: Nutrition): boolean {
  return n.calories !== null || n.protein !== null || n.carbs !== null || n.fat !== null;
}

/**
 * Parse a nutrition value string like "350 kcal" or "25g" into a number.
 */
export function parseNutritionValue(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Math.round(value);
  const match = String(value).match(/[\d.]+/);
  return match ? Math.round(parseFloat(match[0])) : null;
}
