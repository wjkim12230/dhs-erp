import { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import apiClient from '@/services/apiClient';
import { useCreateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';
import StickyActions from '@/components/common/StickyActions';
import type { Model } from '@dhs/shared';

export default function DrawingCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useCreateDrawing();
  const [form, setForm] = useState<any>({});
  const { data: models } = useQuery({ queryKey: ['models','select'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb:1 }}>도면 등록</Typography>
      <StickyActions>
        <Button variant="contained" onClick={() => mutation.mutate(form, { onSuccess: () => { enqueueSnackbar('등록됨',{variant:'success'}); navigate('/drawings'); } })}>등록</Button>
        <Button variant="outlined" onClick={() => navigate('/drawings')}>취소</Button>
      </StickyActions>
      <Grid container spacing={2} sx={{ maxWidth:600 }}>
        <Grid item xs={12}><ImageUpload value={form.imageUrl} onChange={(url) => setForm((p: any) => ({...p, imageUrl: url}))} /></Grid>
        <Grid item xs={6}><TextField label="길이수" type="number" value={form.lengthCount||''} onChange={(e) => setForm((p: any) => ({...p, lengthCount: +e.target.value}))} /></Grid>
        <Grid item xs={6}><TextField select label="모델" value={form.modelId||''} onChange={(e) => setForm((p: any) => ({...p, modelId: +e.target.value}))} required>{models?.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}</TextField></Grid>
      </Grid>
    </CardContent></Card>
  );
}
