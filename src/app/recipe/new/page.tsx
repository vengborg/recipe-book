'use client';

import Header from '@/components/Header';
import RecipeForm from '@/components/RecipeForm';

export default function NewRecipePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 animate-fade-in-up stagger-1">
          <p className="font-[family-name:var(--font-sans)] text-sm font-medium text-terracotta uppercase tracking-widest mb-3">
            New Recipe
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-ink mb-3">
            Add a Recipe
          </h1>
          <p className="text-ink-light text-lg">
            Found something delicious? Save it here so we don&apos;t forget.
          </p>
          <div className="editorial-divider mt-4" />
        </div>
        <RecipeForm />
      </div>
    </div>
  );
}
