'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Recipe, ProteinType, CookingMethod, TimeCategory } from '@/lib/types';
import { getRecipes, getRecentRecipes } from '@/lib/recipes';
import RecipeCard from '@/components/RecipeCard';
import RecipeGrid from '@/components/RecipeGrid';
import FilterBar from '@/components/FilterBar';

function getTimeCategory(minutes: number | null): TimeCategory | null {
  if (!minutes) return null;
  if (minutes < 30) return 'quick';
  if (minutes <= 60) return 'medium';
  return 'long';
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [selectedProtein, setSelectedProtein] = useState<ProteinType | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<CookingMethod | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setRecipes(getRecipes());
    setRecentRecipes(getRecentRecipes(4));
    setMounted(true);
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (selectedProtein && r.proteinType !== selectedProtein) return false;
      if (selectedMethod && r.cookingMethod !== selectedMethod) return false;
      if (selectedTime && getTimeCategory(r.totalTimeMinutes) !== selectedTime) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${r.title} ${r.description} ${r.ingredients.join(' ')}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [recipes, selectedProtein, selectedMethod, selectedTime, searchQuery]);

  const hasActiveFilters = selectedProtein || selectedMethod || selectedTime || searchQuery;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-neutral-900 tracking-tight">
            Recipe Book
          </Link>
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Recipe</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Recently Added */}
        {recentRecipes.length > 0 && !hasActiveFilters && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-5 tracking-tight">
              Recently Added
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Browse All */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
              {hasActiveFilters ? 'Filtered Results' : 'All Recipes'}
              {hasActiveFilters && (
                <span className="ml-2 text-sm font-normal text-neutral-400">
                  {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                showFilters
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>

          {showFilters && (
            <div className="mb-6">
              <FilterBar
                selectedProtein={selectedProtein}
                selectedMethod={selectedMethod}
                selectedTime={selectedTime}
                onProteinChange={setSelectedProtein}
                onMethodChange={setSelectedMethod}
                onTimeChange={setSelectedTime}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          <RecipeGrid
            recipes={filteredRecipes}
            emptyMessage={hasActiveFilters ? 'No recipes match your filters.' : 'No recipes yet. Add your first one!'}
          />
        </section>
      </main>
    </div>
  );
}
