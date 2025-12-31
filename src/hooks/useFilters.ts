import { useState, useCallback, useMemo } from 'react';
import type { Filters, Note, NoteStatus, DateFilter } from '../types';

const initialFilters: Filters = {
  statuses: [],
  tagIds: [],
  searchQuery: '',
  dateFilter: 'all',
};

function getDateRange(filter: DateFilter, customStart?: string, customEnd?: string): { start: Date | null; end: Date | null } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'today':
      return { start: today, end: now };
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: today };
    }
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { start: weekAgo, end: now };
    }
    case 'month': {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { start: monthAgo, end: now };
    }
    case 'custom':
      return {
        start: customStart ? new Date(customStart) : null,
        end: customEnd ? new Date(customEnd + 'T23:59:59') : null,
      };
    default:
      return { start: null, end: null };
  }
}

export function useFilters(notes: Note[]) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const toggleStatus = useCallback((status: NoteStatus) => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status],
    }));
  }, []);

  const toggleTag = useCallback((tagId: number) => {
    setFilters(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setDateFilter = useCallback((dateFilter: DateFilter) => {
    setFilters(prev => ({ ...prev, dateFilter }));
  }, []);

  const setCustomDateRange = useCallback((start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateFilter: 'custom',
      customDateStart: start,
      customDateEnd: end,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const filteredNotes = useMemo(() => {
    const { start, end } = getDateRange(filters.dateFilter, filters.customDateStart, filters.customDateEnd);

    return notes.filter(note => {
      // Filter by status
      if (filters.statuses.length > 0 && !filters.statuses.includes(note.status)) {
        return false;
      }

      // Filter by tags (note must have ALL selected tags)
      if (filters.tagIds.length > 0) {
        const noteTagIds = note.tags.map(t => t.id);
        if (!filters.tagIds.every(id => noteTagIds.includes(id))) {
          return false;
        }
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!note.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by date
      if (start || end) {
        const noteDate = new Date(note.created_at.replace(' ', 'T'));
        if (start && noteDate < start) return false;
        if (end && noteDate > end) return false;
      }

      return true;
    });
  }, [notes, filters]);

  const hasActiveFilters = filters.statuses.length > 0 ||
                           filters.tagIds.length > 0 ||
                           filters.searchQuery !== '' ||
                           filters.dateFilter !== 'all';

  return {
    filters,
    filteredNotes,
    toggleStatus,
    toggleTag,
    setSearchQuery,
    setDateFilter,
    setCustomDateRange,
    clearFilters,
    hasActiveFilters,
  };
}
