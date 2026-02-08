'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecipeFormData, Recipe } from '@/lib/types';
import { addRecipe, updateRecipe } from '@/lib/store';

interface RecipeFormProps {
  recipe?: Recipe;
}

export default function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const isEditing = !!recipe;

  const [title, setTitle] = useState(recipe?.title || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [ingredients, setIngredients] = useState(recipe?.ingredients.join('\n') || '');
  const [instructions, setInstructions] = useState(recipe?.instructions.join('\n') || '');
  const [tags, setTags] = useState(recipe?.tags.join(', ') || '');
  const [notes, setNotes] = useState(recipe?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(recipe?.photoUrl || '');
  const [servings, setServings] = useState(recipe?.servings || '');
  const [cookTime, setCookTime] = useState(recipe?.cookTime || '');
  const [prepTime, setPrepTime] = useState(recipe?.prepTime || '');
  const [sourceUrl, setSourceUrl] = useState(recipe?.sourceUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: RecipeFormData = {
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredients.split('\n').map((i) => i.trim()).filter(Boolean),
      instructions: instructions.split('\n').map((i) => i.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      notes: notes.trim(),
      photoUrl: photoUrl.trim(),
      servings: servings.trim(),
      cookTime: cookTime.trim(),
      prepTime: prepTime.trim(),
      sourceUrl: sourceUrl.trim(),
    };

    if (isEditing && recipe) {
      updateRecipe(recipe.id, data);
      router.push(`/recipe/${recipe.id}`);
    } else {
      const newRecipe = addRecipe(data);
      router.push(`/recipe/${newRecipe.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Recipe Title <span className="text-terracotta">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Grandma's Sunday Gravy"
          className="form-input text-lg font-[family-name:var(--font-display)]"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short love letter to this dish..."
          className="form-input min-h-[80px] resize-y"
          rows={3}
        />
      </div>

      {/* Photo URL */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Photo URL
        </label>
        <input
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="form-input"
        />
        {photoUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-linen aspect-video">
            <img
              src={photoUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Time + Servings Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
            Prep Time
          </label>
          <input
            type="text"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="15 min"
            className="form-input"
          />
        </div>
        <div>
          <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
            Cook Time
          </label>
          <input
            type="text"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="45 min"
            className="form-input"
          />
        </div>
        <div>
          <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
            Servings
          </label>
          <input
            type="text"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4"
            className="form-input"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Ingredients <span className="text-terracotta">*</span>
        </label>
        <p className="text-sm text-ink-muted mb-2 font-[family-name:var(--font-sans)]">One ingredient per line</p>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={'2 cups all-purpose flour\n1 tsp salt\n3 large eggs'}
          className="form-input min-h-[160px] resize-y font-mono text-sm leading-relaxed"
          required
          rows={8}
        />
      </div>

      {/* Instructions */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Instructions <span className="text-terracotta">*</span>
        </label>
        <p className="text-sm text-ink-muted mb-2 font-[family-name:var(--font-sans)]">One step per line</p>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={'Preheat oven to 375°F.\nMix dry ingredients in a large bowl.\nAdd wet ingredients and stir until just combined.'}
          className="form-input min-h-[200px] resize-y leading-relaxed"
          required
          rows={10}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Tags
        </label>
        <p className="text-sm text-ink-muted mb-2 font-[family-name:var(--font-sans)]">Comma-separated</p>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="dinner, Italian, pasta, quick"
          className="form-input"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tips, variations, personal observations..."
          className="form-input min-h-[80px] resize-y"
          rows={3}
        />
      </div>

      {/* Source URL */}
      <div>
        <label className="block font-[family-name:var(--font-sans)] text-sm font-semibold text-ink mb-2 uppercase tracking-wider">
          Source URL
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://seriouseats.com/..."
          className="form-input"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-linen">
        <button type="submit" className="btn-primary flex-1 sm:flex-none">
          {isEditing ? 'Save Changes' : 'Add Recipe'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary flex-1 sm:flex-none"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
