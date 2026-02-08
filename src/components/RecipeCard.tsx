'use client';

import Link from 'next/link';
import { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <article className={`recipe-card group bg-card rounded-2xl overflow-hidden shadow-sm border border-linen/50 animate-fade-in-up ${staggerClass}`}>
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-linen relative">
          {recipe.photoUrl ? (
            <img
              src={recipe.photoUrl}
              alt={recipe.title}
              className="recipe-image w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-linen to-cream-dark">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-ink-muted/30">
                <path d="M24 8C18 8 12 12 12 20C12 20 8 20 8 28C8 36 14 40 24 40C34 40 40 36 40 28C40 20 36 20 36 20C36 12 30 8 24 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 4V8M20 6L22 10M28 6L26 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
          {/* Cook time badge */}
          {recipe.cookTime && (
            <div className="absolute bottom-3 right-3 bg-ink/70 backdrop-blur-sm text-white text-xs font-[family-name:var(--font-sans)] font-medium px-2.5 py-1 rounded-full">
              {recipe.cookTime}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[0.65rem] font-[family-name:var(--font-sans)] font-medium uppercase tracking-wider text-terracotta"
                >
                  {tag}{recipe.tags.indexOf(tag) < Math.min(recipe.tags.length, 3) - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink leading-tight mb-2 group-hover:text-terracotta transition-colors">
            {recipe.title}
          </h3>

          <p className="text-ink-muted text-sm leading-relaxed line-clamp-2">
            {recipe.description}
          </p>

          {/* Footer meta */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-linen">
            {recipe.servings && (
              <span className="text-xs font-[family-name:var(--font-sans)] text-ink-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                {recipe.servings} {recipe.servings === '1' ? 'serving' : 'servings'}
              </span>
            )}
            {recipe.prepTime && (
              <span className="text-xs font-[family-name:var(--font-sans)] text-ink-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {recipe.prepTime} prep
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
