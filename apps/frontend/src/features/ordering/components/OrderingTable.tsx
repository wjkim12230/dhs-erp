import { Button, Tooltip, Chip } from '@heroui/react';
import { Edit, Trash2, Check, Copy, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Ordering, OrderStatus } from '@dhs/shared';
import { formatDate, ORDER_STATUS_LABELS } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';

interface Props { data: Ordering[]; total: number; page: number; pageSize: number; loading: boolean; activeTab: OrderStatus; onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void; onDelete: (id: number) => void; onComplete: (id: number) => void; onRecover: (id: number) => void; }

const statusColor: Record<string, 'primary'|'success'|'default'> = { ACTIVE:'primary', COMPLETED:'success', DELETED:'default' };

export default function OrderingTable({ data, total, page, pageSize, loading, activeTab, onPageChange, onPageSizeChange, onDelete, onComplete, onRecover }: Props) {
  const navigate = useNavigate();
  const columns = [
    { key: 'orderNumber', label: '수주번호', width: 120 },
    { key: 'customerName', label: '고객명', width: 120 },
    { key: 'model', label: '모델', width: 100, render: (_: any, r: any) => r.model?.name ?? '-' },
    { key: 'orderDate', label: '수주일', width: 110, render: (v: string) => formatDate(v) },
    { key: 'dueDate', label: '납기일', width: 110, render: (v: string) => formatDate(v) },
    { key: 'quantity', label: '수량', width: 80 },
    { key: 'status', label: '상태', width: 80, render: (v: OrderStatus) => <Chip size="sm" color={statusColor[v]} variant="flat">{ORDER_STATUS_LABELS[v]}</Chip> },
    { key: 'actions', label: '', width: 160, render: (_: any, r: Ordering) => (
      <div className="flex gap-1">
        {activeTab === 'ACTIVE' && <>
          <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/orderings/${r.id}/edit`)}><Edit size={14} /></Button></Tooltip>
          <Tooltip content="완료"><Button isIconOnly size="sm" variant="light" color="success" onPress={() => { if(confirm('완료?')) onComplete(r.id); }}><Check size={14} /></Button></Tooltip>
          <Tooltip content="복사"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/orderings/${r.id}/copy`)}><Copy size={14} /></Button></Tooltip>
          <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) onDelete(r.id); }}><Trash2 size={14} /></Button></Tooltip>
        </>}
        {activeTab === 'COMPLETED' && <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/orderings/${r.id}/edit`)}><Edit size={14} /></Button></Tooltip>}
        {activeTab === 'DELETED' && <Tooltip content="복구"><Button isIconOnly size="sm" variant="light" color="primary" onPress={() => { if(confirm('복구?')) onRecover(r.id); }}><Undo2 size={14} /></Button></Tooltip>}
      </div>
    )},
  ];
  return <DataTable columns={columns} rows={data} total={total} page={page} pageSize={pageSize} loading={loading} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />;
}
