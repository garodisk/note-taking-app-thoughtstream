import { useState, useRef, useEffect } from 'react';
import type { Note, NoteStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { getNextStatus } from '../utils/statusUtils';
import { TagBadge } from './TagBadge';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: number, content: string) => void;
  onUpdateStatus: (id: number, status: NoteStatus) => void;
  onDelete: (id: number) => void;
  onTagClick?: (tagId: number) => void;
}

export function NoteCard({ note, onUpdate, onUpdateStatus, onDelete, onTagClick }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editContent.trim() && editContent !== note.content) {
      onUpdate(note.id, editContent.trim());
    } else {
      setEditContent(note.content);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditContent(note.content);
      setIsEditing(false);
    }
  };

  const handleStatusClick = () => {
    onUpdateStatus(note.id, getNextStatus(note.status));
  };

  // Format time
  const time = note.created_at.split(' ')[1]?.slice(0, 5) || '';

  return (
    <div
      className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <textarea
              ref={inputRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          ) : (
            <p
              className="text-gray-900 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
              onClick={() => setIsEditing(true)}
            >
              {note.content}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={note.status} onClick={handleStatusClick} />
            {note.tags.map(tag => (
              <TagBadge
                key={tag.id}
                tag={tag}
                onClick={() => onTagClick?.(tag.id)}
              />
            ))}
            <span className="text-xs text-gray-400 ml-auto">{time}</span>
          </div>
        </div>

        <div className={`flex-shrink-0 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
