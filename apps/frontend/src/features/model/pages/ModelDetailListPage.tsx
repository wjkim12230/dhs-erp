import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { useModelDetails, useCreateModelDetail, useDeleteModelDetail } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelDetailListPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const mid = Number(modelId);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useModelDetails(mid);
  const createMut = useCreateModelDetail(mid);
  const deleteMut = useDeleteModelDetail(mid);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', priority: 0 });

  const columns: GridColDef[] = [
    { field: 'name', headerName: '상세항목명', flex: 1 },
    { field: 'priority', headerName: '우선순위', width: 100 },
    { field: 'actions', headerName: '', width: 60, sortable: false, renderCell: (p: any) => (
      <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨', {variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
    )},
  ];

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>모델 상세항목</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm({name:'',priority:0}); setOpen(true); }}>추가</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.data?.length??0} page={0} pageSize={100} loading={isLoading} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>상세항목 추가</DialogTitle>
        <DialogContent sx={{ pt:'16px !important' }}>
          <TextField label="항목명" value={form.name} onChange={(e) => setForm(p=>({...p,name:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField label="우선순위" type="number" value={form.priority} onChange={(e) => setForm(p=>({...p,priority:+e.target.value}))} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button variant="contained" onClick={() => createMut.mutate(form, { onSuccess: () => { setOpen(false); setForm({name:'',priority:0}); enqueueSnackbar('등록됨', {variant:'success'}); } })}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
