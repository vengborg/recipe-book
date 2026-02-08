'use client';

import { Nutrition } from '@/lib/types';
import { hasNutrition } from '@/lib/nutrition';

interface NutritionCardProps {
  nutrition: Nutrition;
}

function MacroRing({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | null;
  unit: string;
  color: string;
}) {
  if (value === null) return null;
  return (
    <div className="text-center">
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${color} flex items-center justify-center mx-auto mb-1.5`}
      >
        <span className="text-sm sm:text-base font-bold">{value}</span>
      </div>
      <span className="text-xs text-neutral-500">
        {unit}
        <br />
        {label}
      </span>
    </div>
  );
}

export default function NutritionCard({ nutrition }: NutritionCardProps) {
  if (!hasNutrition(nutrition)) return null;

  return (
    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
        Nutrition {nutrition.perServing ? 'per serving' : 'total'}
      </h4>
      <div className="flex items-center justify-around gap-2">
        <MacroRing
          label="Calories"
          value={nutrition.calories}
          unit="kcal"
          color="bg-orange-100 text-orange-700"
        />
        <MacroRing
          label="Protein"
          value={nutrition.protein}
          unit="g"
          color="bg-red-100 text-red-700"
        />
        <MacroRing
          label="Carbs"
          value={nutrition.carbs}
          unit="g"
          color="bg-blue-100 text-blue-700"
        />
        <MacroRing
          label="Fat"
          value={nutrition.fat}
          unit="g"
          color="bg-yellow-100 text-yellow-700"
        />
      </div>
    </div>
  );
}
