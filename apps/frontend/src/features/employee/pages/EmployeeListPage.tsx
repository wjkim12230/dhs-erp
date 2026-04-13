import { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Department, EmploymentStatus, Headquarter, enumToOptions, DEPARTMENT_LABELS, EMPLOYMENT_STATUS_LABELS, HEADQUARTER_LABELS } from '@dhs/shared';
import type { EmployeeFilter } from '@dhs/shared';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import { useAuthStore } from '@/stores/authStore';
import { useSnackbar } from 'notistack';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<EmployeeFilter>({ page: 1, limit: 20 });
  const [searchName, setSearchName] = useState('');
  const { data, isLoading } = useEmployees(filters);
  const deleteMut = useDeleteEmployee();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>직원관리</Typography>
        {hasRole('SUPER', 'ADMIN') && <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/employees/create')}>직원 등록</Button>}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="이름 검색" value={searchName} onChange={(e) => setSearchName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setFilters((p) => ({ ...p, name: searchName, page: 1 }))} sx={{ width: 180 }} />
        <TextField select size="small" label="부서" value={filters.department || ''} onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value as any, page: 1 }))} sx={{ width: 140 }}>
          <MenuItem value="">전체</MenuItem>
          {enumToOptions(Department, DEPARTMENT_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="본부" value={filters.headquarter || ''} onChange={(e) => setFilters((p) => ({ ...p, headquarter: e.target.value as any, page: 1 }))} sx={{ width: 140 }}>
          <MenuItem value="">전체</MenuItem>
          {enumToOptions(Headquarter, HEADQUARTER_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="재직상태" value={filters.employmentStatus || ''} onChange={(e) => setFilters((p) => ({ ...p, employmentStatus: e.target.value as any, page: 1 }))} sx={{ width: 120 }}>
          <MenuItem value="">전체</MenuItem>
          {enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Stack>
      <EmployeeTable data={data?.data ?? []} total={data?.meta?.total ?? 0} page={(filters.page ?? 1) - 1} pageSize={filters.limit ?? 20} loading={isLoading}
        onPaginationChange={(m) => setFilters((p) => ({ ...p, page: m.page + 1, limit: m.pageSize }))}
        onDelete={(id) => deleteMut.mutate(id, { onSuccess: () => enqueueSnackbar('삭제되었습니다.', { variant: 'success' }) })} />
    </Box>
  );
}
