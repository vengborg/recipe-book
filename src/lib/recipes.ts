import { Recipe, RecipeFormData } from './types';
import { seedRecipes } from './seed-recipes';

const STORAGE_KEY = 'recipe-book-v8';

function generateId(): string {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getRecipes(): Recipe[] {
  if (typeof window === 'undefined') return seedRecipes;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRecipes));
    return seedRecipes;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seedRecipes;
  }
}

export function getRecipeById(id: string): Recipe | undefined {
  return getRecipes().find((r) => r.id === id);
}

export function addRecipe(data: RecipeFormData): Recipe {
  const recipes = getRecipes();
  const recipe: Recipe = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  recipes.unshift(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipe;
}

export function updateRecipe(id: string, data: Partial<RecipeFormData>): Recipe | undefined {
  const recipes = getRecipes();
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  recipes[index] = { ...recipes[index], ...data, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return recipes[index];
}

export function deleteRecipe(id: string): boolean {
  const recipes = getRecipes();
  const filtered = recipes.filter((r) => r.id !== id);
  if (filtered.length === recipes.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getRecentRecipes(count: number = 4): Recipe[] {
  return getRecipes()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}
