import { useState } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add, Delete, ViewList } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import apiClient from '@/services/apiClient';
import type { PaginationParams, Model } from '@dhs/shared';
import { useCheckItems, useCreateCheckItem, useDeleteCheckItem } from '../hooks/useCheckItems';
import DataTable from '@/components/common/DataTable';

export default function CheckItemListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page:1, limit:20 });
  const { data, isLoading } = useCheckItems(filters);
  const createMut = useCreateCheckItem();
  const deleteMut = useDeleteCheckItem();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ name:'', modelId:'', priority:0 });
  const { data: models } = useQuery({ queryKey: ['models','select'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  const columns: GridColDef[] = [
    { field: 'name', headerName: '검사항목명', flex: 1 },
    { field: 'priority', headerName: '우선순위', width: 90 },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => navigate(`/check-items/${p.row.id}/details`)}><ViewList fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨',{variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];
  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>검사항목</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm({name:'',modelId:'',priority:0}); setOpen(true); }}>추가</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading} onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>검사항목 추가</DialogTitle>
        <DialogContent sx={{ pt:'16px !important' }}>
          <TextField label="항목명" value={form.name} onChange={(e) => setForm((p: any)=>({...p,name:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField select label="모델" value={form.modelId} onChange={(e) => setForm((p: any)=>({...p,modelId:+e.target.value}))} fullWidth sx={{mb:2}}>{models?.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField>
          <TextField label="우선순위" type="number" value={form.priority} onChange={(e) => setForm((p: any)=>({...p,priority:+e.target.value}))} fullWidth />
        </DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>취소</Button><Button variant="contained" onClick={() => createMut.mutate(form, { onSuccess: () => { setOpen(false); enqueueSnackbar('등록됨',{variant:'success'}); } })}>저장</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
