import { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import apiClient from '@/services/apiClient';
import type { AppSettings } from '@dhs/shared';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: async () => { const r = await apiClient.get('/settings'); return r.data.data as AppSettings; } });
  const mutation = useMutation({ mutationFn: async (v: Partial<AppSettings>) => { await apiClient.patch('/settings', v); }, onSuccess: () => { qc.invalidateQueries({queryKey:['settings']}); enqueueSnackbar('저장됨',{variant:'success'}); } });
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', py:10 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb:3 }}>앱 설정</Typography>
      <Card sx={{ maxWidth:500 }}><CardContent>
        <TextField label="기본 언어" value={form.defaultLocale||''} onChange={(e) => setForm((p: any)=>({...p,defaultLocale:e.target.value}))} fullWidth sx={{mb:2}} />
        <FormControlLabel control={<Switch checked={form.international||false} onChange={(e) => setForm((p: any)=>({...p,international:e.target.checked}))} />} label="국제화 모드" sx={{mb:2, display:'block'}} />
        <TextField label="마지막 수주번호" type="number" value={form.lastOrderNumber||0} onChange={(e) => setForm((p: any)=>({...p,lastOrderNumber:+e.target.value}))} fullWidth sx={{mb:2}} />
        <Button variant="contained" onClick={() => mutation.mutate(form)} disabled={mutation.isPending}>저장</Button>
      </CardContent></Card>
    </Box>
  );
}
