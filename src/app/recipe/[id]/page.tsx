'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recipe, PROTEIN_LABELS, METHOD_LABELS } from '@/lib/types';
import { getRecipeById, deleteRecipe } from '@/lib/recipes';
import IngredientList from '@/components/IngredientList';
import NutritionCard from '@/components/NutritionCard';
import VideoEmbed from '@/components/VideoEmbed';
import StepByStep from '@/components/StepByStep';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const found = getRecipeById(id);
    setRecipe(found || null);
    setMounted(true);
  }, [params.id]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Recipe not found</p>
        <Link href="/" className="text-sm text-neutral-900 underline underline-offset-4">
          Back to recipes
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this recipe?')) {
      deleteRecipe(recipe.id);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-neutral-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-neutral-100">
          <img
            src={recipe.photoUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
            }}
          />
        </div>

        {/* Title & Meta */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-3">
            {recipe.title}
          </h1>
          <p className="text-neutral-500 text-base leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.prepTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Prep: {recipe.prepTime}
              </span>
            )}
            {recipe.cookTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                Cook: {recipe.cookTime}
              </span>
            )}
            {recipe.servings && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Serves {recipe.servings}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
              {PROTEIN_LABELS[recipe.proteinType]}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {METHOD_LABELS[recipe.cookingMethod]}
            </span>
          </div>

          {/* Source link */}
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View original recipe
            </a>
          )}
        </div>

        {/* Video */}
        {recipe.videoUrl && (
          <div className="mb-8">
            <VideoEmbed url={recipe.videoUrl} />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Ingredients + Nutrition */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900 mb-4 tracking-tight">Ingredients</h2>
              <IngredientList ingredients={recipe.ingredients} />
            </div>
            <NutritionCard nutrition={recipe.nutrition} />
          </div>

          {/* Main: Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
              <h2 className="text-base font-bold text-neutral-900 mb-4 tracking-tight">Instructions</h2>
              <StepByStep instructions={recipe.instructions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
