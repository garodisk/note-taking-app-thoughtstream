import type { DayGroup, NoteStatus } from '../types';
import { NoteCard } from './NoteCard';

interface DaySectionProps {
  dayGroup: DayGroup;
  onUpdateNote: (id: number, content: string) => void;
  onUpdateNoteStatus: (id: number, status: NoteStatus) => void;
  onDeleteNote: (id: number) => void;
  onTagClick?: (tagId: number) => void;
}

export function DaySection({
  dayGroup,
  onUpdateNote,
  onUpdateNoteStatus,
  onDeleteNote,
  onTagClick,
}: DaySectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{dayGroup.displayDate}</h2>
        <span className="text-sm text-gray-500">
          {dayGroup.notes.length} note{dayGroup.notes.length !== 1 ? 's' : ''}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="space-y-3">
        {dayGroup.notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={onUpdateNote}
            onUpdateStatus={onUpdateNoteStatus}
            onDelete={onDeleteNote}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
}
