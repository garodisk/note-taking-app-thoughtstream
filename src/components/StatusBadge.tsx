import type { NoteStatus } from '../types';
import { STATUS_CONFIG } from '../utils/statusUtils';

interface StatusBadgeProps {
  status: NoteStatus;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, onClick, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center font-medium rounded-full transition-colors ${config.className} ${sizeClasses}`}
      title="Click to change status"
    >
      {config.label}
    </button>
  );
}
