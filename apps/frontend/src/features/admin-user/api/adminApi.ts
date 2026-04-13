import apiClient from '@/services/apiClient';
import type { Admin, AdminCreateDto, PaginatedResponse, ApiResponse, PaginationParams } from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const adminApi = {
  getList: async (p?: PaginationParams): Promise<PaginatedResponse<Admin>> => {
    const res = await apiClient.get(`/admins${buildQueryString(p ?? {})}`); return res.data;
  },
  create: async (data: AdminCreateDto): Promise<ApiResponse<Admin>> => {
    const res = await apiClient.post('/admins', data); return res.data;
  },
  delete: async (id: number): Promise<void> => { await apiClient.delete(`/admins/${id}`); },
  resetPassword: async (id: number, password: string): Promise<void> => {
    await apiClient.post(`/admins/${id}/reset-password`, { password });
  },
};
