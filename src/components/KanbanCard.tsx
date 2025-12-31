import { useState, useRef, useEffect } from 'react';
import type { Note, NoteStatus } from '../types';
import { TagBadge } from './TagBadge';

interface KanbanCardProps {
  note: Note;
  onUpdate: (id: number, content: string) => void;
  onUpdateStatus: (id: number, status: NoteStatus) => void;
  onDelete: (id: number) => void;
  onTagClick?: (tagId: number) => void;
}

export function KanbanCard({ note, onUpdate, onDelete, onTagClick }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTooltip(false);
  };

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

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('noteId', note.id.toString());
    setIsDragging(true);
    setShowTooltip(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const time = note.created_at.split(' ')[1]?.slice(0, 5) || '';
  const date = note.created_at.split(' ')[0] || '';
  const isLongContent = note.content.length > 100;

  return (
    <div
      ref={cardRef}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={4}
        />
      ) : (
        <p
          className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded p-1 -m-1 line-clamp-3"
          onClick={() => setIsEditing(true)}
        >
          {note.content}
        </p>
      )}

      {/* Hover Tooltip for Full Content */}
      {showTooltip && isLongContent && !isEditing && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 p-4 bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-xl max-w-md max-h-64 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap">{note.content}</p>
          <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.map(tag => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onClick={() => onTagClick?.(tag.id)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">{date}</span>
          <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
