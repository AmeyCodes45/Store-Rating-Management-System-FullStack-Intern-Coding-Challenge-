import { axiosClient } from './axiosClient';
import { CreateStoreData, UpdateStoreData, Store, PaginatedResponse, CreateStoreResponse } from '../types';

export const storeApi = {
  create: async (storeData: CreateStoreData): Promise<CreateStoreResponse> => {
    const response = await axiosClient.post('/stores', storeData);
    return response.data.data;
  },

  getAll: async (page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC'): Promise<PaginatedResponse<Store>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await axiosClient.get(`/stores?${params}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Store> => {
    const response = await axiosClient.get(`/stores/${id}`);
    return response.data.data;
  },

  update: async (id: string, storeData: UpdateStoreData): Promise<Store> => {
    const response = await axiosClient.patch(`/stores/${id}`, storeData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/stores/${id}`);
  },

  getCount: async (): Promise<{ total: number }> => {
    const response = await axiosClient.get('/stores/count');
    return response.data.data;
  },

  getAverageRating: async (id: string): Promise<{ average: number; total: number }> => {
    const response = await axiosClient.get(`/stores/${id}/average`);
    return response.data.data;
  },
};
