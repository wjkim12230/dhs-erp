import apiClient from '@/services/apiClient';
import type { Drawing, PaginatedResponse, ApiResponse, PaginationParams, DrawingCreateDto } from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const drawingApi = {
  getList: async (p?: PaginationParams): Promise<PaginatedResponse<Drawing>> => {
    const res = await apiClient.get(`/drawings${buildQueryString(p ?? {})}`); return res.data;
  },
  getById: async (id: number): Promise<ApiResponse<Drawing>> => {
    const res = await apiClient.get(`/drawings/${id}`); return res.data;
  },
  create: async (data: DrawingCreateDto): Promise<ApiResponse<Drawing>> => {
    const res = await apiClient.post('/drawings', data); return res.data;
  },
  update: async (id: number, data: Partial<DrawingCreateDto> & { version: number }): Promise<ApiResponse<Drawing>> => {
    const res = await apiClient.patch(`/drawings/${id}`, data); return res.data;
  },
  delete: async (id: number): Promise<void> => { await apiClient.delete(`/drawings/${id}`); },
};
