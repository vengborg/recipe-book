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
          <img
            src={recipe.photoUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80';
            }}
          />
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
