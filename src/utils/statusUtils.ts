import type { NoteStatus } from '../types';

export const STATUS_CONFIG: Record<NoteStatus, { label: string; className: string }> = {
  none: {
    label: 'Note',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
  },
  todo: {
    label: 'To Do',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  done: {
    label: 'Done',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
};

const STATUS_CYCLE: Record<NoteStatus, NoteStatus> = {
  none: 'todo',
  todo: 'in_progress',
  in_progress: 'done',
  done: 'none',
};

export function getNextStatus(current: NoteStatus): NoteStatus {
  return STATUS_CYCLE[current];
}
