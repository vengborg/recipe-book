export interface Nutrition {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  perServing: boolean;
}

export type ProteinType =
  | 'chicken'
  | 'beef'
  | 'pork'
  | 'fish'
  | 'seafood'
  | 'tofu'
  | 'eggs'
  | 'none';

export type CookingMethod =
  | 'air-fryer'
  | 'oven'
  | 'stovetop'
  | 'grill'
  | 'slow-cooker'
  | 'instant-pot'
  | 'no-cook'
  | 'other';

export type TimeCategory = 'quick' | 'medium' | 'long';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  photoUrl: string;
  servings: string;
  cookTime: string;
  prepTime: string;
  totalTimeMinutes: number | null;
  sourceUrl: string;
  videoUrl: string;
  proteinType: ProteinType;
  cookingMethod: CookingMethod;
  nutrition: Nutrition;
  createdAt: string;
  updatedAt: string;
}

export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;

export interface ScrapedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  photoUrl: string;
  servings: string;
  cookTime: string;
  prepTime: string;
  totalTimeMinutes: number | null;
  sourceUrl: string;
  videoUrl: string;
  nutrition: Nutrition;
  proteinType: ProteinType;
  cookingMethod: CookingMethod;
}

export const PROTEIN_LABELS: Record<ProteinType, string> = {
  chicken: 'Chicken',
  beef: 'Beef',
  pork: 'Pork',
  fish: 'Fish',
  seafood: 'Seafood',
  tofu: 'Plant-Based',
  eggs: 'Eggs',
  none: 'No Protein',
};

export const METHOD_LABELS: Record<CookingMethod, string> = {
  'air-fryer': 'Air Fryer',
  oven: 'Oven',
  stovetop: 'Stovetop',
  grill: 'Grill',
  'slow-cooker': 'Slow Cooker',
  'instant-pot': 'Instant Pot',
  'no-cook': 'No-Cook',
  other: 'Other',
};

export const TIME_LABELS: Record<TimeCategory, string> = {
  quick: '< 30 min',
  medium: '30–60 min',
  long: '60+ min',
};
