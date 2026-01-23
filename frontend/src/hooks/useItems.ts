'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Item, ItemFormData, ItemsResponse, ApiResponse } from '@/types/item';

interface ItemFilters {
  type?: string;
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export function useItems() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getItemsByType = useCallback(async (type: string, page = 1, limit = 10): Promise<ItemsResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/items', { params: { type, page, limit } });
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllItems = useCallback(async (filters?: ItemFilters): Promise<ItemsResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (filters?.type && filters.type !== 'all') params.type = filters.type;
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;
      const response = await api.get('/api/items', { params });
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItemById = useCallback(async (id: string): Promise<Item | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/items/${id}`);
      return response.data.data || response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitItem = useCallback(async (data: ItemFormData): Promise<ApiResponse<Item> | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/items', data);
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: Partial<ItemFormData>): Promise<ApiResponse<Item> | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/items/${id}`, data);
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<ApiResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/api/items/${id}`);
      return response.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, getItemsByType, getAllItems, getItemById, submitItem, updateItem, deleteItem };
}
