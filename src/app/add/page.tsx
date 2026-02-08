'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RecipeFormData,
  ScrapedRecipe,
  ProteinType,
  CookingMethod,
  PROTEIN_LABELS,
  METHOD_LABELS,
} from '@/lib/types';
import { addRecipe } from '@/lib/recipes';
import { emptyNutrition } from '@/lib/nutrition';
import AddByUrl from '@/components/AddByUrl';

const emptyForm: RecipeFormData = {
  title: '',
  description: '',
  ingredients: [],
  instructions: [],
  photoUrl: '',
  servings: '',
  cookTime: '',
  prepTime: '',
  totalTimeMinutes: null,
  sourceUrl: '',
  videoUrl: '',
  proteinType: 'none',
  cookingMethod: 'other',
  nutrition: emptyNutrition(),
};

export default function AddRecipePage() {
  const router = useRouter();
  const [form, setForm] = useState<RecipeFormData>(emptyForm);
  const [ingredientText, setIngredientText] = useState('');
  const [instructionText, setInstructionText] = useState('');
  const [imported, setImported] = useState(false);

  const handleScraped = (scraped: ScrapedRecipe) => {
    setForm({
      ...scraped,
    });
    setIngredientText(scraped.ingredients.join('\n'));
    setInstructionText(scraped.instructions.join('\n'));
    setImported(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipe: RecipeFormData = {
      ...form,
      ingredients: ingredientText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: instructionText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    addRecipe(recipe);
    router.push('/');
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-6">Add Recipe</h1>

        {/* URL Import */}
        <div className="mb-8">
          <AddByUrl onScraped={handleScraped} />
        </div>

        {imported && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            ✓ Recipe imported! Review the details below and save.
          </div>
        )}

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Chicken Tikka Masala"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short description..."
              rows={2}
              className={inputClass}
            />
          </div>

          {/* Photo & Video URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Photo URL</label>
              <input
                type="url"
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="YouTube or Vimeo link"
                className={inputClass}
              />
            </div>
          </div>

          {/* Times & Servings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Prep Time</label>
              <input
                type="text"
                value={form.prepTime}
                onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                placeholder="15 min"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Cook Time</label>
              <input
                type="text"
                value={form.cookTime}
                onChange={(e) => setForm({ ...form, cookTime: e.target.value })}
                placeholder="30 min"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Total (min)</label>
              <input
                type="number"
                value={form.totalTimeMinutes ?? ''}
                onChange={(e) =>
                  setForm({ ...form, totalTimeMinutes: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="45"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Servings</label>
              <input
                type="text"
                value={form.servings}
                onChange={(e) => setForm({ ...form, servings: e.target.value })}
                placeholder="4"
                className={inputClass}
              />
            </div>
          </div>

          {/* Protein & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Protein</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(PROTEIN_LABELS) as ProteinType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, proteinType: p })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.proteinType === p
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {PROTEIN_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Cooking Method</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(METHOD_LABELS) as CookingMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, cookingMethod: m })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.cookingMethod === m
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {METHOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className={labelClass}>Ingredients (one per line)</label>
            <textarea
              value={ingredientText}
              onChange={(e) => setIngredientText(e.target.value)}
              placeholder={"1 lb chicken thighs\n2 tbsp olive oil\n1 tsp salt"}
              rows={6}
              className={inputClass}
            />
          </div>

          {/* Instructions */}
          <div>
            <label className={labelClass}>Instructions (one step per line)</label>
            <textarea
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              placeholder={"Preheat oven to 400°F\nSeason chicken with salt and pepper\nBake for 25 minutes"}
              rows={6}
              className={inputClass}
            />
          </div>

          {/* Nutrition */}
          <div>
            <label className={labelClass}>Nutrition (per serving)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Calories</label>
                <input
                  type="number"
                  value={form.nutrition.calories ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        calories: e.target.value ? parseInt(e.target.value) : null,
                      },
                    })
                  }
                  placeholder="350"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={form.nutrition.protein ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        protein: e.target.value ? parseInt(e.target.value) : null,
                      },
                    })
                  }
                  placeholder="25"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={form.nutrition.carbs ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        carbs: e.target.value ? parseInt(e.target.value) : null,
                      },
                    })
                  }
                  placeholder="30"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={form.nutrition.fat ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nutrition: {
                        ...form.nutrition,
                        fat: e.target.value ? parseInt(e.target.value) : null,
                      },
                    })
                  }
                  placeholder="15"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Source URL */}
          <div>
            <label className={labelClass}>Source URL</label>
            <input
              type="url"
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              placeholder="https://original-recipe-site.com/..."
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-8 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Save Recipe
            </button>
            <Link
              href="/"
              className="px-6 py-3 text-neutral-500 rounded-xl text-sm font-medium hover:text-neutral-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
