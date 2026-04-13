import apiClient from '@/services/apiClient';
import type { ModelGroup, Model, ModelDetail, PaginatedResponse, ApiResponse, PaginationParams, ModelCreateDto, ModelGroupCreateDto } from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const modelApi = {
  // Model Groups
  getGroups: async (p?: PaginationParams): Promise<PaginatedResponse<ModelGroup>> => {
    const res = await apiClient.get(`/model-groups${buildQueryString(p ?? {})}`);
    return res.data;
  },
  createGroup: async (data: ModelGroupCreateDto): Promise<ApiResponse<ModelGroup>> => {
    const res = await apiClient.post('/model-groups', data);
    return res.data;
  },
  updateGroup: async (id: number, data: Partial<ModelGroupCreateDto> & { version: number }): Promise<ApiResponse<ModelGroup>> => {
    const res = await apiClient.patch(`/model-groups/${id}`, data);
    return res.data;
  },
  deleteGroup: async (id: number): Promise<void> => { await apiClient.delete(`/model-groups/${id}`); },

  // Models
  getList: async (p?: PaginationParams & { modelGroupId?: number }): Promise<PaginatedResponse<Model>> => {
    const res = await apiClient.get(`/models${buildQueryString(p ?? {})}`);
    return res.data;
  },
  getById: async (id: number): Promise<ApiResponse<Model>> => {
    const res = await apiClient.get(`/models/${id}`);
    return res.data;
  },
  create: async (data: ModelCreateDto): Promise<ApiResponse<Model>> => {
    const res = await apiClient.post('/models', data);
    return res.data;
  },
  update: async (id: number, data: Partial<ModelCreateDto> & { version: number }): Promise<ApiResponse<Model>> => {
    const res = await apiClient.patch(`/models/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => { await apiClient.delete(`/models/${id}`); },

  // Model Details
  getDetails: async (modelId: number): Promise<PaginatedResponse<ModelDetail>> => {
    const res = await apiClient.get(`/models/${modelId}/details?limit=100`);
    return res.data;
  },
  createDetail: async (modelId: number, data: { name: string; priority?: number }): Promise<ApiResponse<ModelDetail>> => {
    const res = await apiClient.post(`/models/${modelId}/details`, data);
    return res.data;
  },
  updateDetail: async (modelId: number, detailId: number, data: { name?: string; priority?: number; version: number }): Promise<ApiResponse<ModelDetail>> => {
    const res = await apiClient.patch(`/models/${modelId}/details/${detailId}`, data);
    return res.data;
  },
  deleteDetail: async (modelId: number, detailId: number): Promise<void> => {
    await apiClient.delete(`/models/${modelId}/details/${detailId}`);
  },
};
