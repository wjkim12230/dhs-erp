import apiClient from '@/services/apiClient';
import type { Specification, SpecificationDetail, PaginatedResponse, ApiResponse, PaginationParams, SpecificationCreateDto, SpecificationDetailCreateDto } from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const specificationApi = {
  getList: async (p?: PaginationParams & { modelId?: number }): Promise<PaginatedResponse<Specification>> => {
    const res = await apiClient.get(`/specifications${buildQueryString(p ?? {})}`); return res.data;
  },
  create: async (data: SpecificationCreateDto): Promise<ApiResponse<Specification>> => {
    const res = await apiClient.post('/specifications', data); return res.data;
  },
  update: async (id: number, data: Partial<SpecificationCreateDto> & { version: number }): Promise<ApiResponse<Specification>> => {
    const res = await apiClient.patch(`/specifications/${id}`, data); return res.data;
  },
  delete: async (id: number): Promise<void> => { await apiClient.delete(`/specifications/${id}`); },
  getDetails: async (specId: number): Promise<PaginatedResponse<SpecificationDetail>> => {
    const res = await apiClient.get(`/specifications/${specId}/details?limit=100`); return res.data;
  },
  createDetail: async (specId: number, data: SpecificationDetailCreateDto): Promise<ApiResponse<SpecificationDetail>> => {
    const res = await apiClient.post(`/specifications/${specId}/details`, data); return res.data;
  },
  deleteDetail: async (specId: number, detailId: number): Promise<void> => {
    await apiClient.delete(`/specifications/${specId}/details/${detailId}`);
  },
};
