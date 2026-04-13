import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '@dhs/shared';
import { POSITION_LABELS, DEPARTMENT_LABELS, HEADQUARTER_LABELS, EMPLOYMENT_STATUS_LABELS } from '@dhs/shared';
import { formatDate } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  data: Employee[]; total: number; page: number; pageSize: number; loading: boolean;
  onPaginationChange: (m: GridPaginationModel) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({ data, total, page, pageSize, loading, onPaginationChange, onDelete }: Props) {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const canEdit = hasRole('SUPER', 'ADMIN');

  const columns: GridColDef[] = [
    { field: 'employeeNumber', headerName: '사번', width: 100 },
    { field: 'name', headerName: '이름', width: 100 },
    { field: 'position', headerName: '직급', width: 90, valueFormatter: (v: string) => POSITION_LABELS[v as keyof typeof POSITION_LABELS] ?? v },
    { field: 'headquarter', headerName: '본부', width: 120, valueFormatter: (v: string) => HEADQUARTER_LABELS[v as keyof typeof HEADQUARTER_LABELS] ?? v },
    { field: 'department', headerName: '부서', width: 110, valueFormatter: (v: string) => DEPARTMENT_LABELS[v as keyof typeof DEPARTMENT_LABELS] ?? v },
    { field: 'employmentStatus', headerName: '상태', width: 80, valueFormatter: (v: string) => EMPLOYMENT_STATUS_LABELS[v as keyof typeof EMPLOYMENT_STATUS_LABELS] ?? v },
    { field: 'contact', headerName: '연락처', width: 130 },
    { field: 'joinDate', headerName: '입사일', width: 110, valueFormatter: (v: string) => formatDate(v) },
    ...(canEdit ? [{
      field: 'actions', headerName: '', width: 100, sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton size="small" onClick={() => navigate(`/employees/${params.row.id}/edit`)}><Edit fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => { if (confirm('삭제하시겠습니까?')) onDelete(params.row.id); }}><Delete fontSize="small" /></IconButton>
        </>
      ),
    }] : []),
  ];

  return <DataTable columns={columns} rows={data} total={total} page={page} pageSize={pageSize} loading={loading} onPaginationChange={onPaginationChange} />;
}
