import { useState } from 'react';
import type { Note, NoteStatus } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  status: NoteStatus;
  color: string;
  notes: Note[];
  onUpdateNote: (id: number, content: string) => void;
  onUpdateNoteStatus: (id: number, status: NoteStatus) => void;
  onDeleteNote: (id: number) => void;
  onTagClick?: (tagId: number) => void;
  onDrop: (noteId: number, status: NoteStatus) => void;
}

const COLOR_CLASSES: Record<string, { header: string; headerDark: string; border: string }> = {
  gray: {
    header: 'bg-gray-100 text-gray-700',
    headerDark: 'dark:bg-gray-800 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
  },
  yellow: {
    header: 'bg-yellow-100 text-yellow-800',
    headerDark: 'dark:bg-yellow-900/30 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  blue: {
    header: 'bg-blue-100 text-blue-800',
    headerDark: 'dark:bg-blue-900/30 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    header: 'bg-green-100 text-green-800',
    headerDark: 'dark:bg-green-900/30 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
};

export function KanbanColumn({
  title,
  status,
  color,
  notes,
  onUpdateNote,
  onUpdateNoteStatus,
  onDeleteNote,
  onTagClick,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const colorClasses = COLOR_CLASSES[color] || COLOR_CLASSES.gray;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const noteId = parseInt(e.dataTransfer.getData('noteId'), 10);
    if (!isNaN(noteId)) {
      onDrop(noteId, status);
    }
  };

  return (
    <div
      className={`flex flex-col rounded-xl border-2 ${colorClasses.border} ${
        isDragOver ? 'border-dashed border-indigo-500 dark:border-indigo-400' : ''
      } bg-gray-50 dark:bg-gray-900 transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`px-4 py-3 rounded-t-lg ${colorClasses.header} ${colorClasses.headerDark}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
            {notes.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[200px]">
        {notes.map(note => (
          <KanbanCard
            key={note.id}
            note={note}
            onUpdate={onUpdateNote}
            onUpdateStatus={onUpdateNoteStatus}
            onDelete={onDeleteNote}
            onTagClick={onTagClick}
          />
        ))}
        {notes.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
            Drop notes here
          </div>
        )}
      </div>
    </div>
  );
}
