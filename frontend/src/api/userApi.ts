import { axiosClient } from './axiosClient';
import { CreateUserData, UpdateUserData, User, PaginatedResponse, CreateAdminData, CreateAdminResponse } from '../types';

export const userApi = {
  create: async (userData: CreateUserData): Promise<User> => {
    const response = await axiosClient.post('/users/register', userData);
    return response.data.data;
  },

  createAdmin: async (adminData: CreateAdminData): Promise<CreateAdminResponse> => {
    const response = await axiosClient.post('/users/admin', adminData);
    return response.data.data;
  },

  getAll: async (page = 1, limit = 10, search = '', filterBy = ''): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filterBy && { filterBy }),
    });
    const response = await axiosClient.get(`/users?${params}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data.data;
  },

  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await axiosClient.patch(`/users/${id}`, userData);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  getCount: async (): Promise<{ total: number; byRole: Record<string, number> }> => {
    const response = await axiosClient.get('/users/count');
    return response.data.data;
  },
};
