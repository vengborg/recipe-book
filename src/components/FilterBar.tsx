'use client';

import {
  ProteinType,
  CookingMethod,
  TimeCategory,
  PROTEIN_LABELS,
  METHOD_LABELS,
  TIME_LABELS,
} from '@/lib/types';

interface FilterBarProps {
  selectedProtein: ProteinType | null;
  selectedMethod: CookingMethod | null;
  selectedTime: TimeCategory | null;
  onProteinChange: (v: ProteinType | null) => void;
  onMethodChange: (v: CookingMethod | null) => void;
  onTimeChange: (v: TimeCategory | null) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

function FilterGroup<T extends string>({
  label,
  options,
  labels,
  selected,
  onChange,
}: {
  label: string;
  options: T[];
  labels: Record<T, string>;
  selected: T | null;
  onChange: (v: T | null) => void;
}) {
  return (
    <div>
      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2 block">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(selected === opt ? null : opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              selected === opt
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({
  selectedProtein,
  selectedMethod,
  selectedTime,
  onProteinChange,
  onMethodChange,
  onTimeChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  const hasFilters = selectedProtein || selectedMethod || selectedTime || searchQuery;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-neutral-100 space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
        />
      </div>

      {/* Filter Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FilterGroup
          label="Protein"
          options={Object.keys(PROTEIN_LABELS) as ProteinType[]}
          labels={PROTEIN_LABELS}
          selected={selectedProtein}
          onChange={onProteinChange}
        />
        <FilterGroup
          label="Method"
          options={Object.keys(METHOD_LABELS) as CookingMethod[]}
          labels={METHOD_LABELS}
          selected={selectedMethod}
          onChange={onMethodChange}
        />
        <FilterGroup
          label="Time"
          options={Object.keys(TIME_LABELS) as TimeCategory[]}
          labels={TIME_LABELS}
          selected={selectedTime}
          onChange={onTimeChange}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => {
            onProteinChange(null);
            onMethodChange(null);
            onTimeChange(null);
            onSearchChange('');
          }}
          className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}
