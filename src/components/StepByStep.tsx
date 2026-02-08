'use client';

import { useState } from 'react';

interface StepByStepProps {
  instructions: string[];
}

export default function StepByStep({ instructions }: StepByStepProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-0">
      {instructions.map((step, i) => {
        const isCompleted = completedSteps.has(i);
        return (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`w-full text-left flex gap-4 p-4 rounded-xl transition-all duration-200 group ${
              isCompleted ? 'bg-green-50/50' : 'hover:bg-neutral-50'
            }`}
          >
            {/* Step number */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
              }`}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>

            {/* Step text */}
            <p
              className={`flex-1 text-sm leading-relaxed pt-1 transition-all ${
                isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-700'
              }`}
            >
              {step}
            </p>
          </button>
        );
      })}
    </div>
  );
}
