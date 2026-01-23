'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { UserProfile, ProfileApiResponse } from '@/types/profile';

interface UpdateProfileData {
  username?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const getProfile = useCallback(async (): Promise<ProfileApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ProfileApiResponse>('/api/auth/me');
      setProfile(response.data.data.user);
      return response.data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr?.response?.data?.message || 'Failed to fetch profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<ProfileApiResponse> => {
    if (!user?.id) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<ProfileApiResponse>(`/api/users/${user.id}`, data);
      setProfile(response.data.data.user);
      return response.data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr?.response?.data?.message || 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const deleteAccount = useCallback(async (): Promise<void> => {
    if (!user?.id) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/users/${user.id}`);
      setProfile(null);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr?.response?.data?.message || 'Failed to delete account';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    getProfile,
    updateProfile,
    deleteAccount,
  };
}
