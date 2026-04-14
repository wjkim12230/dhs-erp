import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { modelApi } from '../api/modelApi';
import type { PaginationParams, ModelCreateDto, ModelGroupCreateDto } from '@dhs/shared';

export function useModelGroups(p?: PaginationParams) {
  return useQuery({ queryKey: ['model-groups', p], queryFn: () => modelApi.getGroups(p), placeholderData: keepPreviousData });
}
export function useModels(p?: PaginationParams & { modelGroupId?: number }) {
  return useQuery({ queryKey: ['models', p], queryFn: () => modelApi.getList(p), placeholderData: keepPreviousData });
}
export function useModel(id: number) {
  return useQuery({ queryKey: ['models', id], queryFn: () => modelApi.getById(id), enabled: id > 0 });
}
export function useModelDetails(modelId: number) {
  return useQuery({ queryKey: ['model-details', modelId], queryFn: () => modelApi.getDetails(modelId), enabled: modelId > 0 });
}

export function useCreateModelGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: ModelGroupCreateDto) => modelApi.createGroup(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['model-groups'] }); } });
}
export function useUpdateModelGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<ModelGroupCreateDto> & { version: number } }) => modelApi.updateGroup(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['model-groups'] }); } });
}
export function useDeleteModelGroup() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => modelApi.deleteGroup(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['model-groups'] }); } });
}

export function useCreateModel() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: ModelCreateDto) => modelApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['models'] }); } });
}
export function useUpdateModel() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<ModelCreateDto> & { version: number } }) => modelApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['models'] }); } });
}
export function useDeleteModel() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => modelApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['models'] }); } });
}

export function useCreateModelDetail(modelId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: { name: string; priority?: number }) => modelApi.createDetail(modelId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['model-details', modelId] }); } });
}
export function useDeleteModelDetail(modelId: number) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (detailId: number) => modelApi.deleteDetail(modelId, detailId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['model-details', modelId] }); } });
}
