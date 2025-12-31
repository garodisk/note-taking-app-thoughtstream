import type { NoteStatus, Tag, Filters } from '../types';
import { STATUS_CONFIG } from '../utils/statusUtils';

interface FilterBarProps {
  filters: Filters;
  tags: Tag[];
  onToggleStatus: (status: NoteStatus) => void;
  onToggleTag: (tagId: number) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUSES: NoteStatus[] = ['todo', 'in_progress', 'done'];

export function FilterBar({
  filters,
  tags,
  onToggleStatus,
  onToggleTag,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Status:</span>
          {STATUSES.map(status => {
            const isActive = filters.statuses.includes(status);
            const config = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => onToggleStatus(status)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                  isActive
                    ? config.className.replace('hover:', '')
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            );
          })}

          {/* Tag filter dropdown */}
          {tags.length > 0 && (
            <>
              <span className="text-sm text-gray-500 ml-4">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {tags.map(tag => {
                  const isActive = filters.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => onToggleTag(tag.id)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${
                        isActive
                          ? 'ring-2 ring-offset-1'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        ['--tw-ring-color' as string]: isActive ? tag.color : undefined,
                      }}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="ml-auto text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
