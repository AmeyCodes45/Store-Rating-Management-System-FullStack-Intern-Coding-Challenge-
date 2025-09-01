import { axiosClient } from './axiosClient';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Making login request to:', `${axiosClient.defaults.baseURL}/auth/login`);
      console.log('Credentials:', { email: credentials.email, password: '***' });
      
      const response = await axiosClient.post('/auth/login', credentials);
      console.log('Login response received:', response.data);
      console.log('Response structure:', {
        success: response.data.success,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : 'No data'
      });
      return response.data.data;
    } catch (error) {
      console.error('Login API error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosClient.patch('/auth/password', { currentPassword, newPassword });
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/refresh');
    return response.data.data;
  },
};
