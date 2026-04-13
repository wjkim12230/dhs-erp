import { useState } from 'react';
import { Card, CardContent, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Model, ModelCreateDto } from '@dhs/shared';
import { Department, enumToOptions, DEPARTMENT_LABELS } from '@dhs/shared';
import { useModelGroups } from '../hooks/useModels';
import StickyActions from '@/components/common/StickyActions';

interface Props { initialValues?: Model; onSubmit: (v: ModelCreateDto) => void; loading?: boolean; }

export default function ModelForm({ initialValues, onSubmit, loading }: Props) {
  const navigate = useNavigate();
  const { data: groupsData } = useModelGroups({ limit: 100 });
  const isEdit = !!initialValues;
  const [form, setForm] = useState<any>(initialValues ?? {});
  const set = (f: string) => (e: any) => setForm((p: any) => ({ ...p, [f]: e?.target ? e.target.value : e }));

  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>{isEdit ? '모델 수정' : '모델 등록'}</Typography>
      <StickyActions>
        <Button variant="contained" onClick={() => onSubmit(form)} disabled={loading}>{isEdit ? '수정' : '등록'}</Button>
        <Button variant="outlined" onClick={() => navigate('/models')}>취소</Button>
      </StickyActions>
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid item xs={12} sm={6}><TextField label="모델명" value={form.name||''} onChange={set('name')} required /></Grid>
        <Grid item xs={12} sm={6}><TextField label="수주명" value={form.orderingName||''} onChange={set('orderingName')} /></Grid>
        <Grid item xs={12} sm={6}>
          <TextField select label="모델그룹" value={form.modelGroupId||''} onChange={set('modelGroupId')} required>
            {groupsData?.data?.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}><TextField label="우선순위" type="number" value={form.priority||''} onChange={set('priority')} /></Grid>
        <Grid item xs={12}>
          <TextField select label="부서" value={form.departments||[]} onChange={(e) => setForm((p: any) => ({...p, departments: e.target.value}))} SelectProps={{multiple: true}}>
            {enumToOptions(Department, DEPARTMENT_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
    </CardContent></Card>
  );
}
