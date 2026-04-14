import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { checkItemApi } from '../api/checkItemApi';
import type { PaginationParams } from '@dhs/shared';

export function useCheckItems(p?: PaginationParams) {
  return useQuery({ queryKey: ['check-items', p], queryFn: () => checkItemApi.getList(p), placeholderData: keepPreviousData });
}
export function useCheckItemDetails(ciId: number) {
  return useQuery({ queryKey: ['check-item-details', ciId], queryFn: () => checkItemApi.getDetails(ciId), enabled: ciId > 0 });
}
export function useCreateCheckItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: { name: string; priority?: number; modelId: number }) => checkItemApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['check-items'] }); } });
}
export function useDeleteCheckItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => checkItemApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['check-items'] }); } });
}
export function useCreateCheckItemDetail(ciId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: { name: string; priority?: number }) => checkItemApi.createDetail(ciId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['check-item-details', ciId] }); } });
}
export function useDeleteCheckItemDetail(ciId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (did: number) => checkItemApi.deleteDetail(ciId, did),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['check-item-details', ciId] }); } });
}
