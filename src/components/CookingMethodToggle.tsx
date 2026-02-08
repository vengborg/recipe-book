'use client';

import { useState } from 'react';

type Mode = 'original' | 'air-fryer';

interface CookingMethodToggleProps {
  originalMethod: string;
  onModeChange: (mode: Mode) => void;
}

export default function CookingMethodToggle({ originalMethod, onModeChange }: CookingMethodToggleProps) {
  const [active, setActive] = useState<Mode>('original');

  const handleToggle = (mode: Mode) => {
    setActive(mode);
    onModeChange(mode);
  };

  return (
    <div className="inline-flex items-center bg-neutral-100 rounded-xl p-1 gap-0.5">
      <button
        onClick={() => handleToggle('original')}
        className={`
          relative px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200
          ${active === 'original'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
          }
        `}
      >
        Original
        <span className="ml-1.5 text-[10px] font-medium opacity-60 uppercase">{originalMethod}</span>
      </button>
      <button
        onClick={() => handleToggle('air-fryer')}
        className={`
          relative px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200
          ${active === 'air-fryer'
            ? 'bg-white text-neutral-900 shadow-sm'
            : 'text-neutral-500 hover:text-neutral-700'
          }
        `}
      >
        <span className="mr-1">🍳</span>
        Air Fryer
        <span className="ml-1.5 text-[10px] font-medium opacity-60">NINJA</span>
      </button>
    </div>
  );
}
