import apiClient from '@/services/apiClient';
import type {
  Ordering,
  OrderingCreateDto,
  OrderingUpdateDto,
  OrderingFilter,
  PaginatedResponse,
  ApiResponse,
} from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const orderingApi = {
  getList: async (filters: OrderingFilter): Promise<PaginatedResponse<Ordering>> => {
    const res = await apiClient.get(`/orderings${buildQueryString(filters)}`);
    return res.data;
  },
  getById: async (id: number): Promise<ApiResponse<Ordering>> => {
    const res = await apiClient.get(`/orderings/${id}`);
    return res.data;
  },
  create: async (data: OrderingCreateDto): Promise<ApiResponse<Ordering>> => {
    const res = await apiClient.post('/orderings', data);
    return res.data;
  },
  update: async (id: number, data: OrderingUpdateDto): Promise<ApiResponse<Ordering>> => {
    const res = await apiClient.patch(`/orderings/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/orderings/${id}`);
  },
  complete: async (id: number): Promise<void> => {
    await apiClient.post(`/orderings/${id}/complete`);
  },
  recover: async (id: number): Promise<void> => {
    await apiClient.post(`/orderings/${id}/recover`);
  },
  copy: async (id: number): Promise<ApiResponse<Ordering>> => {
    const res = await apiClient.post(`/orderings/${id}/copy`);
    return res.data;
  },
};
