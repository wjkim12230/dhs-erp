import { useState } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import type { ModelGroup, PaginationParams } from '@dhs/shared';
import { useModelGroups, useCreateModelGroup, useUpdateModelGroup, useDeleteModelGroup } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelGroupListPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModelGroups(filters);
  const createMut = useCreateModelGroup();
  const updateMut = useUpdateModelGroup();
  const deleteMut = useDeleteModelGroup();
  const [dialog, setDialog] = useState<{ open: boolean; editing?: ModelGroup }>({ open: false });
  const [form, setForm] = useState({ name: '', priority: 0 });

  const openCreate = () => { setForm({ name: '', priority: 0 }); setDialog({ open: true }); };
  const openEdit = (g: ModelGroup) => { setForm({ name: g.name, priority: g.priority }); setDialog({ open: true, editing: g }); };
  const handleSave = () => {
    if (dialog.editing) {
      updateMut.mutate({ id: dialog.editing.id, data: { ...form, version: dialog.editing.version } }, { onSuccess: () => { setDialog({ open: false }); enqueueSnackbar('수정됨', {variant:'success'}); } });
    } else {
      createMut.mutate(form, { onSuccess: () => { setDialog({ open: false }); enqueueSnackbar('등록됨', {variant:'success'}); } });
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: '그룹명', flex: 1 },
    { field: 'priority', headerName: '우선순위', width: 100 },
    { field: 'models', headerName: '모델 수', width: 100, valueGetter: (_v: any, row: any) => row.models?.length ?? 0 },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => openEdit(p.row)}><Edit fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id, { onSuccess: () => enqueueSnackbar('삭제됨', {variant:'success'}) }); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>모델그룹</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>그룹 추가</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading}
        onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />
      <Dialog open={dialog.open} onClose={() => setDialog({open:false})} maxWidth="xs" fullWidth>
        <DialogTitle>{dialog.editing ? '그룹 수정' : '그룹 추가'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField label="그룹명" value={form.name} onChange={(e) => setForm(p=>({...p,name:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField label="우선순위" type="number" value={form.priority} onChange={(e) => setForm(p=>({...p,priority:+e.target.value}))} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({open:false})}>취소</Button>
          <Button variant="contained" onClick={handleSave}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
