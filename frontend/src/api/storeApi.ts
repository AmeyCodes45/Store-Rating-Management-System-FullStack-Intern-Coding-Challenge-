import { axiosClient } from './axiosClient';
import { CreateStoreData, UpdateStoreData, Store, PaginatedResponse, CreateStoreResponse } from '../types';

export const storeApi = {
  create: async (storeData: CreateStoreData): Promise<CreateStoreResponse> => {
    const response = await axiosClient.post('/stores', storeData);
    return response.data.data;
  },

  getAll: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Store>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
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
