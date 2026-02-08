'use client';

import { useState, useCallback } from 'react';
import { categorizeIngredients } from '@/lib/pantry';

interface IngredientListProps {
  ingredients: string[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  const { toBuy, pantry } = categorizeIngredients(ingredients);

  // Track user overrides (toggling between buy/pantry)
  const [overrides, setOverrides] = useState<Record<string, 'buy' | 'pantry'>>({});
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleOverride = useCallback((ingredient: string, currentCategory: 'buy' | 'pantry') => {
    setOverrides((prev) => {
      const newOverrides = { ...prev };
      if (newOverrides[ingredient]) {
        delete newOverrides[ingredient];
      } else {
        newOverrides[ingredient] = currentCategory === 'buy' ? 'pantry' : 'buy';
      }
      return newOverrides;
    });
  }, []);

  const toggleChecked = useCallback((ingredient: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(ingredient)) {
        next.delete(ingredient);
      } else {
        next.add(ingredient);
      }
      return next;
    });
  }, []);

  // Apply overrides
  const finalToBuy = [
    ...toBuy.filter((i) => overrides[i] !== 'pantry'),
    ...pantry.filter((i) => overrides[i] === 'buy'),
  ];
  const finalPantry = [
    ...pantry.filter((i) => overrides[i] !== 'buy'),
    ...toBuy.filter((i) => overrides[i] === 'pantry'),
  ];

  const IngredientItem = ({
    ingredient,
    category,
  }: {
    ingredient: string;
    category: 'buy' | 'pantry';
  }) => {
    const isChecked = checked.has(ingredient);
    return (
      <li className="flex items-start gap-3 py-2 group">
        <button
          onClick={() => toggleChecked(ingredient)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            isChecked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-neutral-300 hover:border-neutral-400'
          }`}
        >
          {isChecked && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span
          className={`flex-1 text-sm leading-relaxed transition-all ${
            isChecked ? 'line-through text-neutral-400' : 'text-neutral-700'
          }`}
        >
          {ingredient}
        </span>
        <button
          onClick={() => toggleOverride(ingredient, category)}
          className="opacity-0 group-hover:opacity-100 text-xs text-neutral-400 hover:text-neutral-600 transition-all whitespace-nowrap"
          title={category === 'buy' ? 'Move to pantry' : 'Move to shopping list'}
        >
          {category === 'buy' ? '→ pantry' : '→ buy'}
        </button>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {/* Need to Buy */}
      {finalToBuy.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-neutral-900">Need to Buy</span>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {finalToBuy.length}
            </span>
          </div>
          <ul className="divide-y divide-neutral-100">
            {finalToBuy.map((ing, i) => (
              <IngredientItem key={`buy-${i}`} ingredient={ing} category="buy" />
            ))}
          </ul>
        </div>
      )}

      {/* Pantry */}
      {finalPantry.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-neutral-500">Probably Have</span>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {finalPantry.length}
            </span>
          </div>
          <ul className="divide-y divide-neutral-100">
            {finalPantry.map((ing, i) => (
              <IngredientItem key={`pantry-${i}`} ingredient={ing} category="pantry" />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
