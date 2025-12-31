import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { DbNote, DbTag } from '../lib/supabase';
import type { Note, NoteStatus, Tag } from '../types';

export function useNotes(userId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);

  const getTagsForNote = useCallback(async (noteId: number): Promise<Tag[]> => {
    const { data, error } = await supabase
      .from('note_tags')
      .select('tag_id, tags(id, name, color)')
      .eq('note_id', noteId);

    if (error || !data) return [];

    const tags: Tag[] = [];
    for (const item of data) {
      const tagData = item.tags as unknown as DbTag | null;
      if (tagData) {
        tags.push({
          id: tagData.id,
          name: tagData.name,
          color: tagData.color,
        });
      }
    }
    return tags;
  }, []);

  const getAllNotes = useCallback(async (): Promise<Note[]> => {
    if (!userId) return [];

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    const typedNotes = notes as DbNote[];

    // Fetch tags for each note
    const notesWithTags: Note[] = await Promise.all(
      typedNotes.map(async (note) => {
        const tags = await getTagsForNote(note.id);
        return {
          id: note.id,
          content: note.content,
          status: note.status as NoteStatus,
          created_at: note.created_at,
          updated_at: note.updated_at,
          tags,
        };
      })
    );

    return notesWithTags;
  }, [userId, getTagsForNote]);

  const createNote = useCallback(async (content: string, status: NoteStatus = 'none'): Promise<Note | null> => {
    if (!userId) return null;
    setIsLoading(true);

    try {
      // Extract hashtags from content
      const hashtagRegex = /#(\w+)/g;
      const hashtags: string[] = [];
      let match;
      while ((match = hashtagRegex.exec(content)) !== null) {
        hashtags.push(match[1].toLowerCase());
      }

      // Create note
      const { data: noteData, error } = await supabase
        .from('notes')
        .insert({ user_id: userId, content, status })
        .select()
        .single();

      if (error || !noteData) throw error;

      const note = noteData as DbNote;

      // Create tags and link them
      for (const tagName of hashtags) {
        // Upsert tag
        const { data: tagData } = await supabase
          .from('tags')
          .upsert({ user_id: userId, name: tagName }, { onConflict: 'user_id,name' })
          .select()
          .single();

        if (tagData) {
          const tag = tagData as DbTag;
          await supabase
            .from('note_tags')
            .insert({ note_id: note.id, tag_id: tag.id });
        }
      }

      const tags = await getTagsForNote(note.id);

      return {
        id: note.id,
        content: note.content,
        status: note.status as NoteStatus,
        created_at: note.created_at,
        updated_at: note.updated_at,
        tags,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, getTagsForNote]);

  const updateNote = useCallback(async (id: number, content: string): Promise<void> => {
    if (!userId) return;

    // Update note
    await supabase
      .from('notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id);

    // Remove old tags
    await supabase.from('note_tags').delete().eq('note_id', id);

    // Extract and add new tags
    const hashtagRegex = /#(\w+)/g;
    let match;
    while ((match = hashtagRegex.exec(content)) !== null) {
      const tagName = match[1].toLowerCase();

      const { data: tagData } = await supabase
        .from('tags')
        .upsert({ user_id: userId, name: tagName }, { onConflict: 'user_id,name' })
        .select()
        .single();

      if (tagData) {
        const tag = tagData as DbTag;
        await supabase
          .from('note_tags')
          .insert({ note_id: id, tag_id: tag.id });
      }
    }
  }, [userId]);

  const updateNoteStatus = useCallback(async (id: number, status: NoteStatus): Promise<void> => {
    await supabase
      .from('notes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
  }, []);

  const deleteNote = useCallback(async (id: number): Promise<void> => {
    await supabase.from('note_tags').delete().eq('note_id', id);
    await supabase.from('notes').delete().eq('id', id);
  }, []);

  return {
    getAllNotes,
    createNote,
    updateNote,
    updateNoteStatus,
    deleteNote,
    isLoading,
  };
}
