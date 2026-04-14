import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { drawingApi } from '../api/drawingApi';
import type { PaginationParams, DrawingCreateDto } from '@dhs/shared';

export function useDrawings(p?: PaginationParams) {
  return useQuery({ queryKey: ['drawings', p], queryFn: () => drawingApi.getList(p), placeholderData: keepPreviousData });
}
export function useDrawing(id: number) {
  return useQuery({ queryKey: ['drawings', id], queryFn: () => drawingApi.getById(id), enabled: id > 0 });
}
export function useCreateDrawing() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: DrawingCreateDto) => drawingApi.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['drawings'] }); } });
}
export function useUpdateDrawing() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: number; data: Partial<DrawingCreateDto> & { version: number } }) => drawingApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['drawings'] }); } });
}
export function useDeleteDrawing() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => drawingApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['drawings'] }); } });
}
