'use client';

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, activeTag, onTagSelect }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect(null)}
        className={`tag-pill ${!activeTag ? 'tag-pill-active' : 'tag-pill-default'}`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag === activeTag ? null : tag)}
          className={`tag-pill ${tag === activeTag ? 'tag-pill-active' : 'tag-pill-default'}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
