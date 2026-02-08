'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';
import { getRecipeById, initializeStore } from '@/lib/store';
import { Recipe } from '@/lib/types';

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeStore();
    const found = getRecipeById(id);
    if (found) {
      setRecipe(found);
    }
    setIsLoaded(true);
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="editorial-divider animate-pulse" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="text-center py-20 px-4">
          <div className="text-5xl mb-4">🤔</div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-3">
            Recipe not found
          </h2>
          <Link href="/" className="btn-primary">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 animate-fade-in-up stagger-1">
          <p className="font-[family-name:var(--font-sans)] text-sm font-medium text-terracotta uppercase tracking-widest mb-3">
            Editing
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-ink mb-3">
            {recipe.title}
          </h1>
          <div className="editorial-divider mt-4" />
        </div>
        <RecipeForm recipe={recipe} />
      </div>
    </div>
  );
}
