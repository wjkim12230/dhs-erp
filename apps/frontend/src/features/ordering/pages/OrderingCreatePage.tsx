import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Grid, Stepper, Step, StepLabel, Stack, Chip, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import dayjs, { Dayjs } from 'dayjs';
import apiClient from '@/services/apiClient';
import { useOrderingWizardStore } from '@/stores/orderingWizardStore';
import { useCreateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import type { Model } from '@dhs/shared';

const STEPS = ['기본정보', '모델선택', '사양선택', '검사항목', '담당자배정'];

export default function OrderingCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const store = useOrderingWizardStore();
  const createMut = useCreateOrdering();
  const [form, setForm] = useState<any>({});
  const [orderDate, setOrderDate] = useState<Dayjs|null>(null);
  const [dueDate, setDueDate] = useState<Dayjs|null>(null);
  const [expDate, setExpDate] = useState<Dayjs|null>(null);

  useEffect(() => { store.reset(); }, []);
  const { data: modelsData } = useQuery({ queryKey: ['models','all'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  const { data: modelDetail } = useQuery({ queryKey: ['models', store.selectedModel?.id], queryFn: async () => { const r = await apiClient.get(`/models/${store.selectedModel!.id}`); return r.data.data as Model; }, enabled: !!store.selectedModel?.id });

  const handleSubmit = () => {
    store.setFormData({ ...form, orderDate: orderDate?.format('YYYY-MM-DD'), dueDate: dueDate?.format('YYYY-MM-DD'), expectedDeliveryDate: expDate?.format('YYYY-MM-DD') });
    const dto = store.buildCreateDto();
    createMut.mutate(dto, { onSuccess: () => { store.reset(); enqueueSnackbar('수주 등록됨', {variant:'success'}); navigate('/orderings'); } });
  };

  const set = (f: string) => (e: any) => setForm((p: any) => ({...p, [f]: e?.target ? e.target.value : e}));

  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb:2 }}>수주 등록</Typography>
      <Stepper activeStep={store.currentStep} sx={{ mb:3 }}>{STEPS.map(l => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}</Stepper>

      {store.currentStep === 0 && (
        <Box>
          <Grid container spacing={2} sx={{ maxWidth:800 }}>
            <Grid item xs={12} sm={4}><TextField label="고객명" value={form.customerName||''} onChange={set('customerName')} required /></Grid>
            <Grid item xs={12} sm={4}><TextField label="수주번호" value={form.orderNumber||''} onChange={set('orderNumber')} required /></Grid>
            <Grid item xs={12} sm={4}><TextField label="현장명" value={form.siteName||''} onChange={set('siteName')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="발주자" value={form.orderer||''} onChange={set('orderer')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="연락처" value={form.customerContact||''} onChange={set('customerContact')} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="수량" value={form.quantity||''} onChange={set('quantity')} /></Grid>
            <Grid item xs={12} sm={4}><DatePicker label="수주일" value={orderDate} onChange={setOrderDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
            <Grid item xs={12} sm={4}><DatePicker label="납기일" value={dueDate} onChange={setDueDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
            <Grid item xs={12} sm={4}><DatePicker label="출하예정일" value={expDate} onChange={setExpDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
            <Grid item xs={12}><TextField label="메모" multiline rows={2} value={form.memo||''} onChange={set('memo')} /></Grid>
          </Grid>
          <Button variant="contained" sx={{mt:2}} onClick={() => { store.setFormData(form); store.nextStep(); }}>다음</Button>
        </Box>
      )}

      {store.currentStep === 1 && (
        <Box>
          <Typography variant="subtitle1" sx={{mb:2}}>모델을 선택하세요</Typography>
          <Stack spacing={1}>
            {modelsData?.map(m => (
              <Chip key={m.id} label={`${m.name} ${m.orderingName ? `(${m.orderingName})` : ''}`} variant={store.selectedModel?.id === m.id ? 'filled' : 'outlined'} color={store.selectedModel?.id === m.id ? 'primary' : 'default'}
                onClick={() => store.setModel(m)} sx={{ justifyContent:'flex-start', height:40 }} />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} sx={{mt:2}}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button variant="contained" disabled={!store.selectedModel} onClick={store.nextStep}>다음</Button>
          </Stack>
        </Box>
      )}

      {store.currentStep === 2 && (
        <Box>
          <Typography variant="subtitle1" sx={{mb:2}}>사양 선택</Typography>
          {modelDetail?.specifications?.map(spec => (
            <Card key={spec.id} variant="outlined" sx={{mb:1, p:2}}>
              <Typography variant="body2" fontWeight={600} sx={{mb:1}}>{spec.name}</Typography>
              <TextField select size="small" value={store.selectedSpecs.find(s=>s.specificationId===spec.id)?.specificationDetailId||''} sx={{minWidth:300}}
                onChange={(e) => { const newSpecs = store.selectedSpecs.filter(s=>s.specificationId!==spec.id); if(e.target.value) newSpecs.push({specificationId:spec.id,specificationDetailId:+e.target.value}); store.setSpecs(newSpecs); }}>
                <MenuItem value="">선택안함</MenuItem>
                {spec.specificationDetails?.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Card>
          ))}
          <Stack direction="row" spacing={1} sx={{mt:2}}><Button onClick={store.prevStep}>이전</Button><Button variant="contained" onClick={store.nextStep}>다음</Button></Stack>
        </Box>
      )}

      {store.currentStep === 3 && (
        <Box>
          <Typography variant="subtitle1" sx={{mb:2}}>검사항목</Typography>
          {modelDetail?.checkItems?.map(ci => (
            <Card key={ci.id} variant="outlined" sx={{mb:1, p:2}}>
              <Typography variant="body2" fontWeight={600} sx={{mb:1}}>{ci.name}</Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {ci.checkItemDetails?.map(d => {
                  const checked = store.selectedChecks.some(c=>c.checkItemDetailId===d.id);
                  return <Chip key={d.id} label={d.name} variant={checked?'filled':'outlined'} color={checked?'primary':'default'} size="small"
                    onClick={() => { if(checked) store.setChecks(store.selectedChecks.filter(c=>c.checkItemDetailId!==d.id)); else store.setChecks([...store.selectedChecks,{checkItemDetailId:d.id}]); }} sx={{cursor:'pointer'}} />;
                })}
              </Stack>
            </Card>
          ))}
          <Stack direction="row" spacing={1} sx={{mt:2}}><Button onClick={store.prevStep}>이전</Button><Button variant="contained" onClick={store.nextStep}>다음</Button></Stack>
        </Box>
      )}

      {store.currentStep === 4 && (
        <Box>
          <Typography variant="subtitle1" sx={{mb:2}}>담당자 배정</Typography>
          <Grid container spacing={2} sx={{ maxWidth:800 }}>
            <Grid item xs={12} sm={6}><EmployeeSelect label="수주 담당자" value={form.orderEmployeeId} onChange={(v) => setForm((p: any)=>({...p,orderEmployeeId:v}))} /></Grid>
            <Grid item xs={12} sm={6}><EmployeeSelect label="접수 담당자" value={form.receiptEmployeeId} onChange={(v) => setForm((p: any)=>({...p,receiptEmployeeId:v}))} /></Grid>
            <Grid item xs={12} sm={6}><EmployeeSelect label="포장 담당자" value={form.packagingEmployeeId} onChange={(v) => setForm((p: any)=>({...p,packagingEmployeeId:v}))} /></Grid>
            <Grid item xs={12} sm={6}><EmployeeSelect label="출하 담당자" value={form.shippingEmployeeId} onChange={(v) => setForm((p: any)=>({...p,shippingEmployeeId:v}))} /></Grid>
          </Grid>
          <Stack direction="row" spacing={1} sx={{mt:2}}>
            <Button onClick={store.prevStep}>이전</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={createMut.isPending}>등록</Button>
          </Stack>
        </Box>
      )}
    </CardContent></Card>
  );
}
