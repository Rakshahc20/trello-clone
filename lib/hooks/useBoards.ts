'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

import { createClient } from '@/lib/supabase/client';
import { Board } from '@/lib/supabase/models';

export function useBoards() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAuthenticatedClient = useCallback(async () => {
    const supabase = createClient();
    const token = await getToken({ template: 'supabase' });
    if (token) {
      supabase.auth.setSession({ access_token: token, refresh_token: '' });
    }
    return supabase;
  }, [getToken]);

  const loadBoards = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBoards(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('Unable to load boards.');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getAuthenticatedClient]);

  const createBoard = useCallback(async () => {
    if (!user?.id) {
      throw new Error('You must be signed in to create a board.');
    }

    setError(null);

    try {
      const supabase = await getAuthenticatedClient();
      const { data, error } = await supabase
        .from('boards')
        .insert({
          title: 'New board',
          description: null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to state
      setBoards(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error('Unable to create board.');
      setError(errorMessage);
      throw errorMessage;
    }
  }, [user?.id, getAuthenticatedClient]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return {
    boards,
    loadBoards,
    createBoard,
    isLoading,
    error,
  };
}
