import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import type { Employee, EmployeeCreateDto } from '@dhs/shared';
import { Position, JobGroup, Headquarter, Department, Gender, EmploymentStatus, enumToOptions, POSITION_LABELS, JOB_GROUP_LABELS, HEADQUARTER_LABELS, DEPARTMENT_LABELS, GENDER_LABELS, EMPLOYMENT_STATUS_LABELS } from '@dhs/shared';
import StickyActions from '@/components/common/StickyActions';
import DaumAddressSearch from '@/components/common/DaumAddressSearch';

interface Props { initialValues?: Employee; onSubmit: (v: EmployeeCreateDto) => void; loading?: boolean; }

export default function EmployeeForm({ initialValues, onSubmit, loading }: Props) {
  const navigate = useNavigate();
  const isEdit = !!initialValues;
  const [form, setForm] = useState<any>(initialValues ?? {});
  const [birthDate, setBirthDate] = useState<Dayjs | null>(initialValues?.birthDate ? dayjs(initialValues.birthDate) : null);
  const [joinDate, setJoinDate] = useState<Dayjs | null>(initialValues?.joinDate ? dayjs(initialValues.joinDate) : null);

  const set = (field: string) => (e: any) => setForm((p: any) => ({ ...p, [field]: e?.target ? e.target.value : e }));

  const handleSubmit = () => {
    onSubmit({ ...form, birthDate: birthDate?.format('YYYY-MM-DD'), joinDate: joinDate?.format('YYYY-MM-DD') });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>{isEdit ? '직원 수정' : '직원 등록'}</Typography>
        <StickyActions>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>{isEdit ? '수정' : '등록'}</Button>
          <Button variant="outlined" onClick={() => navigate('/employees')}>취소</Button>
        </StickyActions>
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          <Grid item xs={12} sm={4}><TextField label="이름" value={form.name || ''} onChange={set('name')} required /></Grid>
          <Grid item xs={12} sm={4}><TextField label="사번" value={form.employeeNumber || ''} onChange={set('employeeNumber')} required disabled={isEdit} /></Grid>
          <Grid item xs={12} sm={4}><TextField select label="성별" value={form.gender || ''} onChange={set('gender')} required>{enumToOptions(Gender, GENDER_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField select label="직급" value={form.position || ''} onChange={set('position')} required>{enumToOptions(Position, POSITION_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField select label="직군" value={form.jobGroup || ''} onChange={set('jobGroup')} required>{enumToOptions(JobGroup, JOB_GROUP_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField select label="본부" value={form.headquarter || ''} onChange={set('headquarter')} required>{enumToOptions(Headquarter, HEADQUARTER_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField select label="부서" value={form.department || ''} onChange={set('department')} required>{enumToOptions(Department, DEPARTMENT_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField select label="재직상태" value={form.employmentStatus || 'ACTIVE'} onChange={set('employmentStatus')}>{enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS).map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</TextField></Grid>
          <Grid item xs={12} sm={4}><TextField label="급여" type="number" value={form.salary || ''} onChange={set('salary')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="연락처" value={form.contact || ''} onChange={set('contact')} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="내선번호" value={form.internalNumber || ''} onChange={set('internalNumber')} /></Grid>
          <Grid item xs={12} sm={4}><DatePicker label="생년월일" value={birthDate} onChange={setBirthDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
          <Grid item xs={12} sm={4}><DatePicker label="입사일" value={joinDate} onChange={setJoinDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
          <Grid item xs={12} sm={8}><DaumAddressSearch value={form.address} onChange={(v) => setForm((p: any) => ({ ...p, address: v }))} /></Grid>
          <Grid item xs={12}><TextField label="메모" multiline rows={3} value={form.memo || ''} onChange={set('memo')} /></Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
