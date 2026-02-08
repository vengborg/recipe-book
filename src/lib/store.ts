'use client';

import { Recipe, RecipeFormData } from './types';
import { seedRecipes } from './seed-recipes';

const STORAGE_KEY = 'recipe-book-recipes';
const SEEDED_KEY = 'recipe-book-seeded';

function generateId(): string {
  return `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getStoredRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

function saveRecipes(recipes: Recipe[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function initializeStore(): void {
  if (typeof window === 'undefined') return;
  
  const hasSeeded = localStorage.getItem(SEEDED_KEY);
  if (!hasSeeded) {
    const existing = getStoredRecipes();
    if (existing.length === 0) {
      saveRecipes(seedRecipes);
    }
    localStorage.setItem(SEEDED_KEY, 'true');
  }
}

export function getAllRecipes(): Recipe[] {
  return getStoredRecipes().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getRecipeById(id: string): Recipe | undefined {
  return getStoredRecipes().find((r) => r.id === id);
}

export function addRecipe(data: RecipeFormData): Recipe {
  const recipes = getStoredRecipes();
  const now = new Date().toISOString();
  const recipe: Recipe = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  recipes.push(recipe);
  saveRecipes(recipes);
  return recipe;
}

export function updateRecipe(id: string, data: RecipeFormData): Recipe | undefined {
  const recipes = getStoredRecipes();
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  
  const updated: Recipe = {
    ...recipes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  recipes[index] = updated;
  saveRecipes(recipes);
  return updated;
}

export function deleteRecipe(id: string): boolean {
  const recipes = getStoredRecipes();
  const filtered = recipes.filter((r) => r.id !== id);
  if (filtered.length === recipes.length) return false;
  saveRecipes(filtered);
  return true;
}

export function getAllTags(): string[] {
  const recipes = getStoredRecipes();
  const tagSet = new Set<string>();
  recipes.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function searchRecipes(query: string, tag?: string): Recipe[] {
  let recipes = getAllRecipes();
  
  if (tag) {
    recipes = recipes.filter((r) => r.tags.includes(tag));
  }
  
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    recipes = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }
  
  return recipes;
}
