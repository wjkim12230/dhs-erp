import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { orderingApi } from '../api/orderingApi';
import type { OrderingFilter, OrderingCreateDto, OrderingUpdateDto } from '@dhs/shared';

export function useOrderings(filters: OrderingFilter) {
  return useQuery({ queryKey: ['orderings', filters], queryFn: () => orderingApi.getList(filters), placeholderData: keepPreviousData });
}
export function useOrdering(id: number) {
  return useQuery({ queryKey: ['orderings', id], queryFn: () => orderingApi.getById(id), enabled: id > 0 });
}
export function useCreateOrdering() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: OrderingCreateDto) => orderingApi.create(data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); } });
}
export function useUpdateOrdering() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: OrderingUpdateDto }) => orderingApi.update(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); } });
}
export function useDeleteOrdering() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => orderingApi.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); } });
}
export function useCompleteOrdering() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => orderingApi.complete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); } });
}
export function useRecoverOrdering() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => orderingApi.recover(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); } });
}
