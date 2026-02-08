export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  notes: string;
  photoUrl: string;
  servings: string;
  cookTime: string;
  prepTime: string;
  sourceUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type RecipeFormData = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
