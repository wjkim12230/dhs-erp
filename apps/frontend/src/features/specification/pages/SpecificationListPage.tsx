import { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Add, Delete, ViewList } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { PaginationParams } from '@dhs/shared';
import { useSpecifications, useDeleteSpecification } from '../hooks/useSpecifications';
import DataTable from '@/components/common/DataTable';

export default function SpecificationListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useSpecifications(filters);
  const deleteMut = useDeleteSpecification();
  const columns: GridColDef[] = [
    { field: 'name', headerName: '사양명', flex: 1 },
    { field: 'priority', headerName: '우선순위', width: 90 },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => navigate(`/specifications/${p.row.id}/details`)}><ViewList fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨',{variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];
  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>사양관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/specifications/create')}>사양 등록</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading} onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />
    </Box>
  );
}
