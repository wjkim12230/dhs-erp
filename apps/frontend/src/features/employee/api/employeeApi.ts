import apiClient from '@/services/apiClient';
import type {
  Employee,
  EmployeeCreateDto,
  EmployeeUpdateDto,
  EmployeeFilter,
  PaginatedResponse,
  ApiResponse,
} from '@dhs/shared';
import { buildQueryString } from '@dhs/shared';

export const employeeApi = {
  getList: async (filters: EmployeeFilter): Promise<PaginatedResponse<Employee>> => {
    const res = await apiClient.get(`/employees${buildQueryString(filters)}`);
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.get(`/employees/${id}`);
    return res.data;
  },

  create: async (data: EmployeeCreateDto): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.post('/employees', data);
    return res.data;
  },

  update: async (id: number, data: EmployeeUpdateDto): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.patch(`/employees/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },

  recover: async (id: number): Promise<void> => {
    await apiClient.post(`/employees/${id}/recover`);
  },

  checkNumber: async (employeeNumber: string): Promise<{ exists: boolean }> => {
    const res = await apiClient.get(`/employees/check-number?employeeNumber=${employeeNumber}`);
    return res.data.data;
  },
};
