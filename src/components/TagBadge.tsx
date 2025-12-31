import type { Tag } from '../types';

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export function TagBadge({ tag, onClick, onRemove, size = 'sm' }: TagBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses}`}
      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
    >
      <button
        onClick={onClick}
        className="hover:underline"
      >
        #{tag.name}
      </button>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70"
        >
          ×
        </button>
      )}
    </span>
  );
}
