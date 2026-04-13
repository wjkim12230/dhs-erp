import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { orderingApi } from '../api/orderingApi';
import type { OrderingFilter, OrderingCreateDto, OrderingUpdateDto } from '@dhs/shared';

export function useOrderings(filters: OrderingFilter) {
  return useQuery({
    queryKey: ['orderings', filters],
    queryFn: () => orderingApi.getList(filters),
    placeholderData: keepPreviousData,
  });
}

export function useOrdering(id: number) {
  return useQuery({
    queryKey: ['orderings', id],
    queryFn: () => orderingApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateOrdering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OrderingCreateDto) => orderingApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); message.success('수주가 등록되었습니다.'); },
    onError: () => message.error('등록에 실패했습니다.'),
  });
}

export function useUpdateOrdering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderingUpdateDto }) => orderingApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); message.success('수정되었습니다.'); },
    onError: (err: any) => {
      if (err.response?.status === 409) message.error('다른 사용자가 이미 수정했습니다.');
      else message.error('수정에 실패했습니다.');
    },
  });
}

export function useDeleteOrdering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderingApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); message.success('삭제되었습니다.'); },
  });
}

export function useCompleteOrdering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderingApi.complete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); message.success('완료 처리되었습니다.'); },
  });
}

export function useRecoverOrdering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => orderingApi.recover(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orderings'] }); message.success('복구되었습니다.'); },
  });
}
