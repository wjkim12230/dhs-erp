import { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete, ViewList } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { PaginationParams } from '@dhs/shared';
import { useModels, useDeleteModel } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModels(filters);
  const deleteMut = useDeleteModel();

  const columns: GridColDef[] = [
    { field: 'name', headerName: '모델명', flex: 1 },
    { field: 'orderingName', headerName: '수주명', flex: 1 },
    { field: 'modelGroup', headerName: '모델그룹', flex: 1, valueGetter: (_v: any, row: any) => row.modelGroup?.name ?? '-' },
    { field: 'priority', headerName: '우선순위', width: 90 },
    { field: 'actions', headerName: '', width: 120, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => navigate(`/models/${p.row.id}/details`)}><ViewList fontSize="small" /></IconButton>
        <IconButton size="small" onClick={() => navigate(`/models/${p.row.id}/edit`)}><Edit fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨', {variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>모델관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/models/create')}>모델 등록</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading}
        onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />
    </Box>
  );
}
