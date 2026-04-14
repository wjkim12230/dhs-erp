import { Button, Tooltip } from '@heroui/react';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '@dhs/shared';
import { POSITION_LABELS, DEPARTMENT_LABELS, HEADQUARTER_LABELS, EMPLOYMENT_STATUS_LABELS } from '@dhs/shared';
import { formatDate } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';
import { useAuthStore } from '@/stores/authStore';

interface Props { data: Employee[]; total: number; page: number; pageSize: number; loading: boolean; onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void; onDelete: (id: number) => void; }

export default function EmployeeTable({ data, total, page, pageSize, loading, onPageChange, onPageSizeChange, onDelete }: Props) {
  const navigate = useNavigate();
  const canEdit = useAuthStore((s) => s.hasRole)('SUPER', 'ADMIN');

  const columns = [
    { key: 'employeeNumber', label: '사번', width: 100 },
    { key: 'name', label: '이름', width: 100 },
    { key: 'position', label: '직급', width: 90, render: (v: string) => POSITION_LABELS[v as keyof typeof POSITION_LABELS] ?? v },
    { key: 'headquarter', label: '본부', width: 120, render: (v: string) => HEADQUARTER_LABELS[v as keyof typeof HEADQUARTER_LABELS] ?? v },
    { key: 'department', label: '부서', width: 110, render: (v: string) => DEPARTMENT_LABELS[v as keyof typeof DEPARTMENT_LABELS] ?? v },
    { key: 'employmentStatus', label: '상태', width: 80, render: (v: string) => EMPLOYMENT_STATUS_LABELS[v as keyof typeof EMPLOYMENT_STATUS_LABELS] ?? v },
    { key: 'contact', label: '연락처', width: 130 },
    { key: 'joinDate', label: '입사일', width: 110, render: (v: string) => formatDate(v) },
    ...(canEdit ? [{ key: 'actions', label: '', width: 90, render: (_: any, row: Employee) => (
      <div className="flex gap-1">
        <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/employees/${row.id}/edit`)}><Edit size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) onDelete(row.id); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )}] : []),
  ];

  return <DataTable columns={columns} rows={data} total={total} page={page} pageSize={pageSize} loading={loading} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />;
}
