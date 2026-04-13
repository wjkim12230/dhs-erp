import { useState } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { Add, Delete, Key } from '@mui/icons-material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { adminApi } from '../api/adminApi';
import { Role, enumToOptions, ROLE_LABELS } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';
import type { PaginationParams } from '@dhs/shared';

export default function AdminListPage() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState<PaginationParams>({ page:1, limit:20 });
  const { data, isLoading } = useQuery({ queryKey: ['admins', filters], queryFn: () => adminApi.getList(filters) });
  const createMut = useMutation({ mutationFn: adminApi.create, onSuccess: () => { qc.invalidateQueries({queryKey:['admins']}); enqueueSnackbar('등록됨',{variant:'success'}); } });
  const deleteMut = useMutation({ mutationFn: adminApi.delete, onSuccess: () => { qc.invalidateQueries({queryKey:['admins']}); enqueueSnackbar('삭제됨',{variant:'success'}); } });
  const resetMut = useMutation({ mutationFn: ({id,pw}:{id:number;pw:string}) => adminApi.resetPassword(id,pw), onSuccess: () => enqueueSnackbar('비밀번호 초기화됨',{variant:'success'}) });

  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<number|null>(null);
  const [createForm, setCreateForm] = useState<any>({});
  const [resetPw, setResetPw] = useState('');

  const columns: GridColDef[] = [
    { field: 'loginId', headerName: '아이디', flex: 1 },
    { field: 'name', headerName: '이름', flex: 1 },
    { field: 'role', headerName: '권한', width: 100, renderCell: (p: any) => <Chip label={ROLE_LABELS[p.value as keyof typeof ROLE_LABELS]} size="small" /> },
    { field: 'isEnabled', headerName: '활성', width: 70, renderCell: (p: any) => <Chip label={p.value?'활성':'비활성'} color={p.value?'success':'default'} size="small" /> },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: (p: any) => (
      <>
        <IconButton size="small" onClick={() => { setResetPw(''); setResetTarget(p.row.id); }}><Key fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => { if(confirm('삭제?')) deleteMut.mutate(p.row.id); }}><Delete fontSize="small" /></IconButton>
      </>
    )},
  ];

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>관리자</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setCreateForm({}); setCreateOpen(true); }}>관리자 추가</Button>
      </Box>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading} onPaginationChange={(m: GridPaginationModel) => setFilters({page:m.page+1,limit:m.pageSize})} />

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>관리자 추가</DialogTitle>
        <DialogContent sx={{pt:'16px !important'}}>
          <TextField label="아이디" value={createForm.loginId||''} onChange={(e) => setCreateForm((p: any)=>({...p,loginId:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField label="이름" value={createForm.name||''} onChange={(e) => setCreateForm((p: any)=>({...p,name:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField label="비밀번호" type="password" value={createForm.password||''} onChange={(e) => setCreateForm((p: any)=>({...p,password:e.target.value}))} fullWidth sx={{mb:2}} />
          <TextField select label="권한" value={createForm.role||''} onChange={(e) => setCreateForm((p: any)=>({...p,role:e.target.value}))} fullWidth>
            {enumToOptions(Role, ROLE_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions><Button onClick={() => setCreateOpen(false)}>취소</Button><Button variant="contained" onClick={() => createMut.mutate(createForm, { onSuccess: () => setCreateOpen(false) })}>저장</Button></DialogActions>
      </Dialog>

      <Dialog open={resetTarget !== null} onClose={() => setResetTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>비밀번호 초기화</DialogTitle>
        <DialogContent sx={{pt:'16px !important'}}>
          <TextField label="새 비밀번호" type="password" value={resetPw} onChange={(e) => setResetPw(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions><Button onClick={() => setResetTarget(null)}>취소</Button><Button variant="contained" onClick={() => resetMut.mutate({id:resetTarget!,pw:resetPw}, { onSuccess: () => setResetTarget(null) })}>초기화</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
