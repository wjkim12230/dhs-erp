import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { employeeApi } from '../api/employeeApi';
import type { EmployeeFilter, EmployeeCreateDto, EmployeeUpdateDto } from '@dhs/shared';

export function useEmployees(filters: EmployeeFilter) {
  return useQuery({ queryKey: ['employees', filters], queryFn: () => employeeApi.getList(filters), placeholderData: keepPreviousData });
}
export function useEmployee(id: number) {
  return useQuery({ queryKey: ['employees', id], queryFn: () => employeeApi.getById(id), enabled: id > 0 });
}
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: EmployeeCreateDto) => employeeApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); } });
}
export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateDto }) => employeeApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); } });
}
export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => employeeApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); } });
}
