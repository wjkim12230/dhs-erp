import { useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { PaginationParams } from '@dhs/shared';
import { useDrawings, useDeleteDrawing } from '../hooks/useDrawings';
import DataTable from '@/components/common/DataTable';

export default function DrawingListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useDrawings(filters);
  const deleteMut = useDeleteDrawing();
  const columns = [
    { key: 'imageUrl', label: '도면', width: 80, render: (v: string) => v ? <img src={v} className="w-12 h-12 rounded object-cover" /> : '-' },
    { key: 'lengthCount', label: '길이수', width: 80 },
    { key: 'actions', label: '', width: 100, render: (_: any, r: any) => (
      <div className="flex gap-1">
        <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/drawings/${r.id}/edit`)}><Edit size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )},
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">도면관리</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => navigate('/drawings/create')}>도면 등록</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))} />
    </div>
  );
}
