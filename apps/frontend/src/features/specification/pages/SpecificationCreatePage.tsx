import { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import apiClient from '@/services/apiClient';
import { useCreateSpecification } from '../hooks/useSpecifications';
import StickyActions from '@/components/common/StickyActions';
import type { Model } from '@dhs/shared';

export default function SpecificationCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useCreateSpecification();
  const [form, setForm] = useState<any>({});
  const { data: models } = useQuery({ queryKey: ['models','select'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  const set = (f: string) => (e: any) => setForm((p: any) => ({...p, [f]: e?.target ? e.target.value : e}));
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb:1 }}>사양 등록</Typography>
      <StickyActions>
        <Button variant="contained" onClick={() => mutation.mutate(form, { onSuccess: () => { enqueueSnackbar('등록됨',{variant:'success'}); navigate('/specifications'); } })}>등록</Button>
        <Button variant="outlined" onClick={() => navigate('/specifications')}>취소</Button>
      </StickyActions>
      <Grid container spacing={2} sx={{ maxWidth:600 }}>
        <Grid item xs={6}><TextField label="사양명" value={form.name||''} onChange={set('name')} required /></Grid>
        <Grid item xs={6}><TextField label="우선순위" type="number" value={form.priority||''} onChange={set('priority')} /></Grid>
        <Grid item xs={12}><TextField select label="모델" value={form.modelId||''} onChange={set('modelId')} required>{models?.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField></Grid>
      </Grid>
    </CardContent></Card>
  );
}
