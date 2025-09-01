import { axiosClient } from './axiosClient';
import { CreateUserData, UpdateUserData, User, PaginatedResponse, CreateAdminData, CreateAdminResponse, UnifiedCreateUserData, UnifiedCreateUserResponse, UpdatePasswordData } from '../types';

export const userApi = {
  create: async (userData: CreateUserData): Promise<User> => {
    const response = await axiosClient.post('/users/register', userData);
    return response.data.data;
  },

  createAdmin: async (adminData: CreateAdminData): Promise<CreateAdminResponse> => {
    const response = await axiosClient.post('/users/admin', adminData);
    return response.data.data;
  },

  createUnified: async (userData: UnifiedCreateUserData): Promise<UnifiedCreateUserResponse> => {
    const response = await axiosClient.post('/users/unified', userData);
    return response.data.data;
  },

  getAll: async (page = 1, limit = 10, search = '', filterBy = '', sortBy = 'createdAt', sortOrder = 'DESC'): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (filterBy) params.append('filterBy', filterBy);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    
    const response = await axiosClient.get(`/users?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data.data;
  },

  update: async (id: string, userData: UpdateUserData): Promise<User> => {
    const response = await axiosClient.patch(`/users/${id}`, userData);
    return response.data.data;
  },

  updatePassword: async (passwordData: UpdatePasswordData): Promise<void> => {
    await axiosClient.patch('/users/password', passwordData);
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  getCount: async (): Promise<{ total: number; byRole: Record<string, number> }> => {
    const response = await axiosClient.get('/users/count');
    return response.data.data;
  },
};
