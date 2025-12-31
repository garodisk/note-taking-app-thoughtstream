export type NoteStatus = 'none' | 'todo' | 'in_progress' | 'done';

export interface Note {
  id: number;
  content: string;
  status: NoteStatus;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export interface Filters {
  statuses: NoteStatus[];
  tagIds: number[];
  searchQuery: string;
  dateFilter: DateFilter;
  customDateStart?: string;
  customDateEnd?: string;
}

export interface DayGroup {
  date: string;
  displayDate: string;
  notes: Note[];
}
