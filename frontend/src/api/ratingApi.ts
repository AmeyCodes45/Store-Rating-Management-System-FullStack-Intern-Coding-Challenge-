import { axiosClient } from './axiosClient';
import { UpsertRatingData, Rating, PaginatedResponse } from '../types';

export const ratingApi = {
  upsert: async (ratingData: UpsertRatingData): Promise<Rating> => {
    const response = await axiosClient.put('/ratings', ratingData);
    return response.data.data;
  },

  getStoreRatings: async (storeId: string, page = 1, limit = 10): Promise<PaginatedResponse<Rating>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await axiosClient.get(`/ratings/stores/${storeId}?${params}`);
    return response.data.data;
  },

  getUserRatings: async (userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Rating>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await axiosClient.get(`/ratings/users/${userId}?${params}`);
    return response.data.data;
  },

  getCount: async (): Promise<{ total: number }> => {
    const response = await axiosClient.get('/ratings/count');
    return response.data.data;
  },
};
