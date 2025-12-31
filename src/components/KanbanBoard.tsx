import { useMemo } from 'react';
import type { Note, NoteStatus } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  notes: Note[];
  onUpdateNote: (id: number, content: string) => void;
  onUpdateNoteStatus: (id: number, status: NoteStatus) => void;
  onDeleteNote: (id: number) => void;
  onTagClick?: (tagId: number) => void;
}

const COLUMNS: { status: NoteStatus; title: string; color: string }[] = [
  { status: 'none', title: 'Notes', color: 'gray' },
  { status: 'todo', title: 'To Do', color: 'yellow' },
  { status: 'in_progress', title: 'In Progress', color: 'blue' },
  { status: 'done', title: 'Done', color: 'green' },
];

export function KanbanBoard({
  notes,
  onUpdateNote,
  onUpdateNoteStatus,
  onDeleteNote,
  onTagClick,
}: KanbanBoardProps) {
  const groupedNotes = useMemo(() => {
    const groups: Record<NoteStatus, Note[]> = {
      none: [],
      todo: [],
      in_progress: [],
      done: [],
    };

    notes.forEach(note => {
      groups[note.status].push(note);
    });

    // Sort by created_at descending within each group
    Object.keys(groups).forEach(status => {
      groups[status as NoteStatus].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );
    });

    return groups;
  }, [notes]);

  const handleDrop = (noteId: number, newStatus: NoteStatus) => {
    onUpdateNoteStatus(noteId, newStatus);
  };

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No notes yet</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start capturing your thoughts using the input above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {COLUMNS.map(column => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          color={column.color}
          notes={groupedNotes[column.status]}
          onUpdateNote={onUpdateNote}
          onUpdateNoteStatus={onUpdateNoteStatus}
          onDeleteNote={onDeleteNote}
          onTagClick={onTagClick}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
