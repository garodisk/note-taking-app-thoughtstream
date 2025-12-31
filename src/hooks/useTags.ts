import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { DbTag } from '../lib/supabase';
import type { Tag } from '../types';

const TAG_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
];

export function useTags(userId: string | undefined) {
  const getAllTags = useCallback(async (): Promise<Tag[]> => {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }

    const tags = data as DbTag[];

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }));
  }, [userId]);

  const createTag = useCallback(async (name: string): Promise<Tag | null> => {
    if (!userId) return null;

    const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

    const { data, error } = await supabase
      .from('tags')
      .upsert({ user_id: userId, name: name.toLowerCase(), color }, { onConflict: 'user_id,name' })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating tag:', error);
      return null;
    }

    const tag = data as DbTag;

    return {
      id: tag.id,
      name: tag.name,
      color: tag.color,
    };
  }, [userId]);

  const updateTagColor = useCallback(async (id: number, color: string): Promise<void> => {
    await supabase
      .from('tags')
      .update({ color })
      .eq('id', id);
  }, []);

  const deleteTag = useCallback(async (id: number): Promise<void> => {
    await supabase.from('note_tags').delete().eq('tag_id', id);
    await supabase.from('tags').delete().eq('id', id);
  }, []);

  return {
    getAllTags,
    createTag,
    updateTagColor,
    deleteTag,
  };
}
