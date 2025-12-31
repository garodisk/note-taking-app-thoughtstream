import type { Note, DayGroup } from '../types';

export function groupNotesByDate(notes: Note[]): DayGroup[] {
  const groups = new Map<string, Note[]>();

  notes.forEach(note => {
    // Extract date part (YYYY-MM-DD)
    const dateKey = note.created_at.split(' ')[0];
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(note);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // Newest first
    .map(([date, notes]) => ({
      date,
      displayDate: formatDisplayDate(date),
      notes: notes.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }));
}

function formatDisplayDate(dateStr: string): string {
  const today = new Date();
  const todayStr = formatDateKey(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';

  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
