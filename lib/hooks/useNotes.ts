'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/lib/provider/AuthProvider';
import { Database } from '@/lib/database.types';

type Note = Database['public']['Tables']['notes']['Row'];

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery({
    queryKey: ['notes'],
    queryFn: async (): Promise<Note[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const getNote = async (id: string): Promise<Note | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  };

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: { title: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...newNote, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...note }: { id: string; title?: string; content?: string; summary?: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('notes')
        .update({ ...note, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    getNote,
    createNote: createNoteMutation.mutateAsync,
    updateNote: updateNoteMutation.mutateAsync,
    deleteNote: deleteNoteMutation.mutateAsync,
  };
}