import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useDrawing, useUpdateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';
import StickyActions from '@/components/common/StickyActions';

export default function DrawingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useDrawing(Number(id));
  const mutation = useUpdateDrawing();
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data?.data) setForm(data.data); }, [data]);
  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', py:10 }}><CircularProgress /></Box>;
  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb:1 }}>도면 수정</Typography>
      <StickyActions>
        <Button variant="contained" onClick={() => mutation.mutate({ id: +id!, data: { imageUrl: form.imageUrl, lengthCount: form.lengthCount, version: form.version } }, { onSuccess: () => { enqueueSnackbar('수정됨',{variant:'success'}); navigate('/drawings'); } })}>수정</Button>
        <Button variant="outlined" onClick={() => navigate('/drawings')}>취소</Button>
      </StickyActions>
      <Grid container spacing={2} sx={{ maxWidth:600 }}>
        <Grid item xs={12}><ImageUpload value={form.imageUrl} onChange={(url) => setForm((p: any) => ({...p, imageUrl: url}))} /></Grid>
        <Grid item xs={6}><TextField label="길이수" type="number" value={form.lengthCount||''} onChange={(e) => setForm((p: any) => ({...p, lengthCount: +e.target.value}))} /></Grid>
      </Grid>
    </CardContent></Card>
  );
}
