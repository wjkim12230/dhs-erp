import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';
import type { EmployeeFilter, EmployeeCreateDto, EmployeeUpdateDto } from '@dhs/shared';

export function useEmployees(filters: EmployeeFilter) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getList(filters),
    placeholderData: keepPreviousData,
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeCreateDto) => employeeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
     
    },
     {
     
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateDto }) =>
      employeeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
     
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
       
      } else {
       
      }
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
     
    },
  });
}
