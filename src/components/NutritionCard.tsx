'use client';

import { Nutrition } from '@/lib/types';
import { hasNutrition } from '@/lib/nutrition';

interface NutritionCardProps {
  nutrition: Nutrition;
}

// Viktor's target macro split
const TARGET = { protein: 35, fat: 40, carbs: 25 };

function calcMacroPercents(nutrition: Nutrition) {
  const p = nutrition.protein ?? 0;
  const f = nutrition.fat ?? 0;
  const c = nutrition.carbs ?? 0;

  // Calories from each macro
  const pCal = p * 4;
  const fCal = f * 9;
  const cCal = c * 4;
  const total = pCal + fCal + cCal;

  if (total === 0) return null;

  return {
    protein: Math.round((pCal / total) * 100),
    fat: Math.round((fCal / total) * 100),
    carbs: Math.round((cCal / total) * 100),
    totalCal: total,
  };
}

function MacroBar({
  label,
  pct,
  target,
  grams,
  color,
  bgColor,
}: {
  label: string;
  pct: number;
  target: number;
  grams: number | null;
  color: string;
  bgColor: string;
}) {
  const diff = pct - target;
  const isClose = Math.abs(diff) <= 5;
  const isOver = diff > 5;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">{label}</span>
          {grams !== null && (
            <span className="text-xs text-neutral-400">{grams}g</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold ${color}`}>{pct}%</span>
          <span className="text-[10px] text-neutral-400">/ {target}%</span>
        </div>
      </div>
      {/* Bar */}
      <div className="relative h-2 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${bgColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
        {/* Target marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-neutral-900/30"
          style={{ left: `${target}%` }}
        />
      </div>
      {/* Status indicator */}
      <div className="flex justify-end">
        <span className={`text-[10px] font-medium ${
          isClose ? 'text-green-600' : isOver ? 'text-amber-600' : 'text-blue-600'
        }`}>
          {isClose ? '✓ On target' : isOver ? `+${diff}% over` : `${Math.abs(diff)}% under`}
        </span>
      </div>
    </div>
  );
}

export default function NutritionCard({ nutrition }: NutritionCardProps) {
  if (!hasNutrition(nutrition)) return null;

  const macros = calcMacroPercents(nutrition);
  if (!macros) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Macros {nutrition.perServing ? 'per serving' : 'total'}
        </h4>
        {nutrition.calories && (
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
            {nutrition.calories} kcal
          </span>
        )}
      </div>

      <div className="space-y-4">
        <MacroBar
          label="Protein"
          pct={macros.protein}
          target={TARGET.protein}
          grams={nutrition.protein}
          color="text-red-600"
          bgColor="bg-red-400"
        />
        <MacroBar
          label="Fat"
          pct={macros.fat}
          target={TARGET.fat}
          grams={nutrition.fat}
          color="text-amber-600"
          bgColor="bg-amber-400"
        />
        <MacroBar
          label="Carbs"
          pct={macros.carbs}
          target={TARGET.carbs}
          grams={nutrition.carbs}
          color="text-blue-600"
          bgColor="bg-blue-400"
        />
      </div>

      {/* Target legend */}
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <p className="text-[10px] text-neutral-400 text-center">
          Target: P {TARGET.protein}% · F {TARGET.fat}% · C {TARGET.carbs}%
          <span className="mx-1">|</span>
          <span className="text-neutral-500">▎</span> = target line
        </p>
      </div>
    </div>
  );
}
