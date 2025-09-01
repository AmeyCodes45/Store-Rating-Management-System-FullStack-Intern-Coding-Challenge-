export enum UserRole {
  ADMIN = 'ADMIN',
  STORE_OWNER = 'STORE_OWNER',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
  ownerId: string;
  owner?: User;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  store?: Store;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  address?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  role?: UserRole;
}

export interface CreateStoreData {
  name: string;
  address?: string;
  ownerId: string;
}

export interface UpdateStoreData {
  name?: string;
  address?: string;
}

export interface UpsertRatingData {
  storeId: string;
  rating: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  address?: string;
}

export interface CreateAdminResponse {
  admin: User;
  credentials: {
    email: string;
    password: string;
  };
}
