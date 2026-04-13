import { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { PaginationParams } from '@dhs/shared';
import { useDrawings, useDeleteDrawing } from '../hooks/useDrawings';
import DataTable from '@/components/common/DataTable';

export default function DrawingListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useDrawings(filters);
  const deleteMut = useDeleteDrawing();
  const columns: GridColDef[] = [
    { field: 'imageUrl', headerName: '도면', width: 80, renderCell: (p: any) => p.value ? <img src={p.value} style={{ width:50, height:50, objectFit:'cover', borderRadius:4 }} /> : '-' },
    { field: 'lengthCount', headerName: '길이수', width: 80 },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => navigate(`/drawings/${p.row.id}/edit`)}><Edit fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨',{variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];
  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>도면관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/drawings/create')}>도면 등록</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading} onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />
    </Box>
  );
}
