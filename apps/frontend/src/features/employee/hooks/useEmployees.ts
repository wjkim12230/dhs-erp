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
      message.success('직원이 등록되었습니다.');
    },
    onError: () => {
      message.error('등록에 실패했습니다.');
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
      message.success('수정되었습니다.');
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        message.error('다른 사용자가 이미 수정했습니다. 새로고침 후 다시 시도하세요.');
      } else {
        message.error('수정에 실패했습니다.');
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
      message.success('삭제되었습니다.');
    },
  });
}
