import { useMemo } from 'react';
import type { Note, NoteStatus } from '../types';
import { DaySection } from './DaySection';
import { groupNotesByDate } from '../utils/groupByDate';

interface TimelineProps {
  notes: Note[];
  onUpdateNote: (id: number, content: string) => void;
  onUpdateNoteStatus: (id: number, status: NoteStatus) => void;
  onDeleteNote: (id: number) => void;
  onTagClick?: (tagId: number) => void;
}

export function Timeline({
  notes,
  onUpdateNote,
  onUpdateNoteStatus,
  onDeleteNote,
  onTagClick,
}: TimelineProps) {
  const dayGroups = useMemo(() => groupNotesByDate(notes), [notes]);

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No notes yet</h3>
        <p className="text-gray-500">
          Start capturing your thoughts using the input above.
        </p>
      </div>
    );
  }

  return (
    <div>
      {dayGroups.map(dayGroup => (
        <DaySection
          key={dayGroup.date}
          dayGroup={dayGroup}
          onUpdateNote={onUpdateNote}
          onUpdateNoteStatus={onUpdateNoteStatus}
          onDeleteNote={onDeleteNote}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
