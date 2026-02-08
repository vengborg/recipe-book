'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import { initializeStore, searchRecipes, getAllTags } from '@/lib/store';
import { Recipe } from '@/lib/types';

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeStore();
    setTags(getAllTags());
    setRecipes(searchRecipes(''));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setRecipes(searchRecipes(query, activeTag || undefined));
  }, [query, activeTag, isLoaded]);

  const totalCount = useMemo(() => recipes.length, [recipes]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="editorial-divider animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-fade-in-up stagger-1">
            <p className="font-[family-name:var(--font-sans)] text-sm font-medium text-terracotta uppercase tracking-widest mb-3">
              Viktor & Meghan&apos;s Kitchen
            </p>
          </div>
          <h1 className="animate-fade-in-up stagger-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] mb-4">
            Our Recipe<br className="hidden sm:block" /> Collection
          </h1>
          <p className="animate-fade-in-up stagger-3 text-ink-light text-lg sm:text-xl max-w-lg leading-relaxed">
            The dishes we love, all in one place. From our kitchen in Palm Springs.
          </p>
          <div className="editorial-divider mt-6 animate-fade-in-up stagger-4" />
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="max-w-6xl mx-auto space-y-4 animate-fade-in-up stagger-5">
          <SearchBar value={query} onChange={setQuery} />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <TagFilter tags={tags} activeTag={activeTag} onTagSelect={setActiveTag} />
            <span className="text-sm font-[family-name:var(--font-sans)] text-ink-muted">
              {totalCount} recipe{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {recipes.length > 0 ? (
            <div className="recipe-grid">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-5xl mb-4">🍳</div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-ink mb-2">
                No recipes found
              </h3>
              <p className="text-ink-muted font-[family-name:var(--font-sans)]">
                {query || activeTag
                  ? 'Try a different search or filter.'
                  : 'Time to add your first recipe!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-linen py-8 px-4 sm:px-6">
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
