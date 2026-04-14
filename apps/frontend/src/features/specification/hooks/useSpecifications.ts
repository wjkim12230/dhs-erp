import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { specificationApi } from '../api/specificationApi';
import type { PaginationParams, SpecificationCreateDto, SpecificationDetailCreateDto } from '@dhs/shared';

export function useSpecifications(p?: PaginationParams & { modelId?: number }) {
  return useQuery({ queryKey: ['specifications', p], queryFn: () => specificationApi.getList(p), placeholderData: keepPreviousData });
}
export function useSpecificationDetails(specId: number) {
  return useQuery({ queryKey: ['specification-details', specId], queryFn: () => specificationApi.getDetails(specId), enabled: specId > 0 });
}
export function useCreateSpecification() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: SpecificationCreateDto) => specificationApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['specifications'] }); } });
}
export function useDeleteSpecification() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => specificationApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['specifications'] }); } });
}
export function useCreateSpecDetail(specId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: SpecificationDetailCreateDto) => specificationApi.createDetail(specId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['specification-details', specId] }); } });
}
export function useDeleteSpecDetail(specId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (detailId: number) => specificationApi.deleteDetail(specId, detailId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['specification-details', specId] }); } });
}
