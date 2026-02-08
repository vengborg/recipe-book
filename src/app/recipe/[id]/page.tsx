'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { getRecipeById, deleteRecipe, initializeStore } from '@/lib/store';
import { Recipe } from '@/lib/types';

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  useEffect(() => {
    initializeStore();
    const found = getRecipeById(id);
    if (found) {
      setRecipe(found);
    }
    setIsLoaded(true);
  }, [id]);

  const handleDelete = () => {
    if (recipe) {
      deleteRecipe(recipe.id);
      router.push('/');
    }
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

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
          <p className="text-ink-muted mb-6 font-[family-name:var(--font-sans)]">
            This recipe might have been deleted or the link is incorrect.
          </p>
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

      {/* Hero Image */}
      {recipe.photoUrl && (
        <div className="w-full max-h-[50vh] overflow-hidden relative animate-fade-in">
          <img
            src={recipe.photoUrl}
            alt={recipe.title}
            className="w-full h-full object-cover max-h-[50vh]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <div className="animate-fade-in-up stagger-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-[family-name:var(--font-sans)] text-ink-muted hover:text-terracotta transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Recipes
          </Link>
        </div>

        {/* Title & Meta */}
        <header className="mb-8 animate-fade-in-up stagger-2">
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag) => (
                <span key={tag} className="tag-pill tag-pill-default">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            {recipe.title}
          </h1>

          {recipe.description && (
            <p className="text-lg sm:text-xl text-ink-light leading-relaxed mb-6">
              {recipe.description}
            </p>
          )}

          <div className="editorial-divider mb-6" />

          {/* Meta bar */}
          <div className="flex flex-wrap gap-6 text-sm font-[family-name:var(--font-sans)]">
            {recipe.prepTime && (
              <div>
                <span className="block text-ink-muted text-xs uppercase tracking-wider mb-1">Prep</span>
                <span className="font-semibold text-ink">{recipe.prepTime}</span>
              </div>
            )}
            {recipe.cookTime && (
              <div>
                <span className="block text-ink-muted text-xs uppercase tracking-wider mb-1">Cook</span>
                <span className="font-semibold text-ink">{recipe.cookTime}</span>
              </div>
            )}
            {recipe.servings && (
              <div>
                <span className="block text-ink-muted text-xs uppercase tracking-wider mb-1">Servings</span>
                <span className="font-semibold text-ink">{recipe.servings}</span>
              </div>
            )}
            {recipe.sourceUrl && (
              <div>
                <span className="block text-ink-muted text-xs uppercase tracking-wider mb-1">Source</span>
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-terracotta hover:underline"
                >
                  View Original →
                </a>
              </div>
            )}
          </div>
        </header>

        {/* Two column on desktop: Ingredients + Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 mb-12">
          {/* Ingredients */}
          <section className="animate-fade-in-up stagger-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-4">
              Ingredients
            </h2>
            <div className="bg-card rounded-xl border border-linen p-5 space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="ingredient-check mt-0.5"
                    checked={checkedIngredients.has(index)}
                    onChange={() => toggleIngredient(index)}
                  />
                  <span className={`text-ink leading-relaxed transition-all ${
                    checkedIngredients.has(index) ? 'line-through opacity-40' : ''
                  }`}>
                    {ingredient}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-ink-muted font-[family-name:var(--font-sans)] mt-2 italic">
              Tap to check off as you go
            </p>
          </section>

          {/* Instructions */}
          <section className="animate-fade-in-up stagger-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-4">
              Instructions
            </h2>
            <ol className="space-y-6">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-[family-name:var(--font-sans)] font-bold text-sm flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-ink leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Notes */}
        {recipe.notes && (
          <section className="mb-12 animate-fade-in-up stagger-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink mb-4">
              Notes
            </h2>
            <div className="bg-honey-light/40 border border-honey-light rounded-xl p-5 sm:p-6">
              <p className="text-ink-light leading-relaxed italic">
                {recipe.notes}
              </p>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="border-t border-linen pt-6 flex flex-wrap gap-3 animate-fade-in-up stagger-6">
          <Link
            href={`/recipe/${recipe.id}/edit`}
            className="btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 2.5L13.5 4.5M10 4L3 11V13H5L12 6L10 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Recipe
          </Link>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-muted font-[family-name:var(--font-sans)]">Sure?</span>
              <button
                onClick={handleDelete}
                className="btn-danger !bg-terracotta !text-white !border-terracotta"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary !py-2 !px-3 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-linen py-8 px-4 sm:px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-sans)] text-sm text-ink-muted">
            Made with love in Palm Springs 🌴
          </span>
          <span className="font-[family-name:var(--font-sans)] text-xs text-ink-muted/50">
            Viktor, Meghan & Dale
          </span>
        </div>
      </footer>
    </div>
  );
}
