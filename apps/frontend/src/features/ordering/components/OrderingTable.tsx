import { IconButton, Chip } from '@mui/material';
import { Edit, Delete, Check, ContentCopy, Undo } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import type { Ordering, OrderStatus } from '@dhs/shared';
import { formatDate, ORDER_STATUS_LABELS } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';

interface Props {
  data: Ordering[]; total: number; page: number; pageSize: number; loading: boolean; activeTab: OrderStatus;
  onPaginationChange: (m: GridPaginationModel) => void;
  onDelete: (id: number) => void; onComplete: (id: number) => void; onRecover: (id: number) => void;
}

export default function OrderingTable({ data, total, page, pageSize, loading, activeTab, onPaginationChange, onDelete, onComplete, onRecover }: Props) {
  const navigate = useNavigate();
  const statusColor: Record<string, 'info'|'success'|'default'> = { ACTIVE:'info', COMPLETED:'success', DELETED:'default' };
  const columns: GridColDef[] = [
    { field: 'orderNumber', headerName: '수주번호', width: 120 },
    { field: 'customerName', headerName: '고객명', width: 120 },
    { field: 'model', headerName: '모델', width: 100, valueGetter: (_v: any, row: any) => row.model?.name ?? '-' },
    { field: 'orderDate', headerName: '수주일', width: 110, valueFormatter: (v: string) => formatDate(v) },
    { field: 'dueDate', headerName: '납기일', width: 110, valueFormatter: (v: string) => formatDate(v) },
    { field: 'quantity', headerName: '수량', width: 80 },
    { field: 'status', headerName: '상태', width: 80, renderCell: (p: any) => <Chip label={ORDER_STATUS_LABELS[p.value as OrderStatus]} color={statusColor[p.value]} size="small" /> },
    { field: 'actions', headerName: '', width: 160, sortable: false, renderCell: (p: any) => (
      <>
        {activeTab === 'ACTIVE' && <>
          <IconButton size="small" onClick={() => navigate(`/orderings/${p.row.id}/edit`)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" color="success" onClick={() => { if(confirm('완료?')) onComplete(p.row.id); }}><Check fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => navigate(`/orderings/${p.row.id}/copy`)}><ContentCopy fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) onDelete(p.row.id); }}><Delete fontSize="small" /></IconButton>
        </>}
        {activeTab === 'COMPLETED' && <IconButton size="small" onClick={() => navigate(`/orderings/${p.row.id}/edit`)}><Edit fontSize="small" /></IconButton>}
        {activeTab === 'DELETED' && <IconButton size="small" color="primary" onClick={() => { if(confirm('복구?')) onRecover(p.row.id); }}><Undo fontSize="small" /></IconButton>}
      </>
    )},
  ];
  return <DataTable columns={columns} rows={data} total={total} page={page} pageSize={pageSize} loading={loading} onPaginationChange={onPaginationChange} />;
}
