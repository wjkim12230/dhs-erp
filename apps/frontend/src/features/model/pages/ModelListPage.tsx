import { useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { PaginationParams, Model } from '@dhs/shared';
import { useModels, useDeleteModel } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModels(filters);
  const deleteMut = useDeleteModel();
  const columns = [
    { key: 'name', label: '모델명' },
    { key: 'orderingName', label: '수주명' },
    { key: 'modelGroup', label: '모델그룹', render: (_: any, r: any) => r.modelGroup?.name ?? '-' },
    { key: 'priority', label: '우선순위', width: 90 },
    { key: 'actions', label: '', width: 120, render: (_: any, r: Model) => (
      <div className="flex gap-1">
        <Tooltip content="상세"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/models/${r.id}/details`)}><List size={14} /></Button></Tooltip>
        <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/models/${r.id}/edit`)}><Edit size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )},
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">모델관리</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => navigate('/models/create')}>모델 등록</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))} />
    </div>
  );
}
