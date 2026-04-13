import apiClient from '@/services/apiClient';
import type { CheckItem, CheckItemDetail, PaginatedResponse, ApiResponse, PaginationParams } from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const checkItemApi = {
  getList: async (p?: PaginationParams): Promise<PaginatedResponse<CheckItem>> => {
    const res = await apiClient.get(`/check-items${buildQueryString(p ?? {})}`); return res.data;
  },
  create: async (data: { name: string; priority?: number; modelId: number }): Promise<ApiResponse<CheckItem>> => {
    const res = await apiClient.post('/check-items', data); return res.data;
  },
  delete: async (id: number): Promise<void> => { await apiClient.delete(`/check-items/${id}`); },
  getDetails: async (ciId: number): Promise<PaginatedResponse<CheckItemDetail>> => {
    const res = await apiClient.get(`/check-items/${ciId}/details?limit=100`); return res.data;
  },
  createDetail: async (ciId: number, data: { name: string; priority?: number }): Promise<ApiResponse<CheckItemDetail>> => {
    const res = await apiClient.post(`/check-items/${ciId}/details`, data); return res.data;
  },
  deleteDetail: async (ciId: number, detailId: number): Promise<void> => {
    await apiClient.delete(`/check-items/${ciId}/details/${detailId}`);
  },
};
