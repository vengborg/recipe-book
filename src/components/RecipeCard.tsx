'use client';

import Link from 'next/link';
import { Recipe, PROTEIN_LABELS, METHOD_LABELS } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const timeLabel = recipe.totalTimeMinutes
    ? recipe.totalTimeMinutes < 60
      ? `${recipe.totalTimeMinutes} min`
      : `${Math.floor(recipe.totalTimeMinutes / 60)}h ${recipe.totalTimeMinutes % 60}m`
    : recipe.cookTime || null;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {recipe.photoUrl ? (
            <img
              src={recipe.photoUrl}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Time badge */}
          {timeLabel && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {timeLabel}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-neutral-900 text-base leading-tight mb-1.5 line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3 flex-1">
            {recipe.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
              {PROTEIN_LABELS[recipe.proteinType]}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {METHOD_LABELS[recipe.cookingMethod]}
            </span>
            {recipe.nutrition.calories && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                {recipe.nutrition.calories} kcal
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
