import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import { useTags } from './hooks/useTags';
import { useFilters } from './hooks/useFilters';
import { useTheme } from './hooks/useTheme';
import { NoteInput } from './components/NoteInput';
import { KanbanBoard } from './components/KanbanBoard';
import { ThemeToggle } from './components/ThemeToggle';
import { DateFilter } from './components/DateFilter';
import { AuthForm } from './components/AuthForm';
import type { Note } from './types';

function AppContent() {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string; color: string }[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  const { getAllNotes, createNote, updateNote, updateNoteStatus, deleteNote } = useNotes(user?.id);
  const { getAllTags } = useTags(user?.id);
  const { filteredNotes, toggleTag, setSearchQuery, setDateFilter, setCustomDateRange, filters, clearFilters, hasActiveFilters } = useFilters(notes);
  const { theme, toggleTheme } = useTheme();

  // Load notes and tags on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingNotes(true);
      const [loadedNotes, loadedTags] = await Promise.all([
        getAllNotes(),
        getAllTags(),
      ]);
      setNotes(loadedNotes);
      setTags(loadedTags);
      setIsLoadingNotes(false);
    };

    if (user) {
      loadData();
    }
  }, [user, getAllNotes, getAllTags]);

  const refreshData = useCallback(async () => {
    const [loadedNotes, loadedTags] = await Promise.all([
      getAllNotes(),
      getAllTags(),
    ]);
    setNotes(loadedNotes);
    setTags(loadedTags);
  }, [getAllNotes, getAllTags]);

  const handleCreateNote = useCallback(async (content: string) => {
    await createNote(content);
    await refreshData();
  }, [createNote, refreshData]);

  const handleUpdateNote = useCallback(async (id: number, content: string) => {
    await updateNote(id, content);
    await refreshData();
  }, [updateNote, refreshData]);

  const handleUpdateNoteStatus = useCallback(async (id: number, status: Note['status']) => {
    await updateNoteStatus(id, status);
    await refreshData();
  }, [updateNoteStatus, refreshData]);

  const handleDeleteNote = useCallback(async (id: number) => {
    await deleteNote(id);
    await refreshData();
  }, [deleteNote, refreshData]);

  const handleTagClick = useCallback((tagId: number) => {
    toggleTag(tagId);
  }, [toggleTag]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                  Saket's
                </span>
                <span className="ml-2 text-white">ThoughtStream</span>
              </h1>
              <p className="text-sm text-indigo-100 mt-1 font-medium">Capture your thoughts, organize your mind</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-white/50"
                    />
                  )}
                  <span className="text-sm text-white/80 hidden sm:block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-white/80 hover:text-white underline"
                  >
                    Sign out
                  </button>
                </div>
              )}
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Date Filter */}
            <DateFilter
              value={filters.dateFilter}
              customStart={filters.customDateStart}
              customEnd={filters.customDateEnd}
              onChange={setDateFilter}
              onCustomChange={setCustomDateRange}
            />

            {/* Tag Filters */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Tags:</span>
                <div className="flex gap-1 flex-wrap">
                  {tags.slice(0, 6).map(tag => {
                    const isActive = filters.tagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${
                          isActive
                            ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          ['--tw-ring-color' as string]: isActive ? tag.color : undefined,
                        }}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Note Input */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <NoteInput onSubmit={handleCreateNote} />
        </div>
      </div>

      {/* Kanban Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {isLoadingNotes ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <KanbanBoard
            notes={filteredNotes}
            onUpdateNote={handleUpdateNote}
            onUpdateNoteStatus={handleUpdateNoteStatus}
            onDeleteNote={handleDeleteNote}
            onTagClick={handleTagClick}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notes.length} total notes • {filteredNotes.length} shown
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const { theme } = useTheme();

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading ThoughtStream...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signInWithGoogle} isLoading={isLoading} />;
  }

  return <AppContent />;
}

export default App;
