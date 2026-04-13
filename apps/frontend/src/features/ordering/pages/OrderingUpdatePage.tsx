import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, Button, Grid, Typography, CircularProgress, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import dayjs, { Dayjs } from 'dayjs';
import { useOrdering, useUpdateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import StickyActions from '@/components/common/StickyActions';

export default function OrderingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useOrdering(Number(id));
  const mutation = useUpdateOrdering();
  const [form, setForm] = useState<any>({});
  const [orderDate, setOrderDate] = useState<Dayjs|null>(null);
  const [dueDate, setDueDate] = useState<Dayjs|null>(null);
  const [expDate, setExpDate] = useState<Dayjs|null>(null);

  useEffect(() => {
    if (data?.data) {
      const o = data.data;
      setForm(o);
      setOrderDate(o.orderDate ? dayjs(o.orderDate) : null);
      setDueDate(o.dueDate ? dayjs(o.dueDate) : null);
      setExpDate(o.expectedDeliveryDate ? dayjs(o.expectedDeliveryDate) : null);
    }
  }, [data]);

  if (isLoading) return <Box sx={{ display:'flex', justifyContent:'center', py:10 }}><CircularProgress /></Box>;
  const set = (f: string) => (e: any) => setForm((p: any) => ({...p, [f]: e?.target ? e.target.value : e}));

  const handleSubmit = () => {
    mutation.mutate({ id: +id!, data: { ...form, orderDate: orderDate?.format('YYYY-MM-DD'), dueDate: dueDate?.format('YYYY-MM-DD'), expectedDeliveryDate: expDate?.format('YYYY-MM-DD'), version: form.version } }, {
      onSuccess: () => { enqueueSnackbar('수정됨', {variant:'success'}); navigate('/orderings'); },
    });
  };

  return (
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb:1 }}>수주 수정</Typography>
      <StickyActions>
        <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}>수정</Button>
        <Button variant="outlined" onClick={() => navigate('/orderings')}>취소</Button>
      </StickyActions>
      <Grid container spacing={2} sx={{ maxWidth:800 }}>
        <Grid item xs={12} sm={4}><TextField label="고객명" value={form.customerName||''} onChange={set('customerName')} required /></Grid>
        <Grid item xs={12} sm={4}><TextField label="수주번호" value={form.orderNumber||''} disabled /></Grid>
        <Grid item xs={12} sm={4}><TextField label="현장명" value={form.siteName||''} onChange={set('siteName')} /></Grid>
        <Grid item xs={12} sm={4}><TextField label="발주자" value={form.orderer||''} onChange={set('orderer')} /></Grid>
        <Grid item xs={12} sm={4}><TextField label="연락처" value={form.customerContact||''} onChange={set('customerContact')} /></Grid>
        <Grid item xs={12} sm={4}><TextField label="수량" value={form.quantity||''} onChange={set('quantity')} /></Grid>
        <Grid item xs={12} sm={4}><DatePicker label="수주일" value={orderDate} onChange={setOrderDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
        <Grid item xs={12} sm={4}><DatePicker label="납기일" value={dueDate} onChange={setDueDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
        <Grid item xs={12} sm={4}><DatePicker label="출하예정일" value={expDate} onChange={setExpDate} slotProps={{textField:{size:'small',fullWidth:true}}} /></Grid>
        <Grid item xs={12} sm={3}><EmployeeSelect label="수주담당" value={form.orderEmployeeId} onChange={(v) => setForm((p: any)=>({...p,orderEmployeeId:v}))} /></Grid>
        <Grid item xs={12} sm={3}><EmployeeSelect label="접수담당" value={form.receiptEmployeeId} onChange={(v) => setForm((p: any)=>({...p,receiptEmployeeId:v}))} /></Grid>
        <Grid item xs={12} sm={3}><EmployeeSelect label="포장담당" value={form.packagingEmployeeId} onChange={(v) => setForm((p: any)=>({...p,packagingEmployeeId:v}))} /></Grid>
        <Grid item xs={12} sm={3}><EmployeeSelect label="출하담당" value={form.shippingEmployeeId} onChange={(v) => setForm((p: any)=>({...p,shippingEmployeeId:v}))} /></Grid>
        <Grid item xs={12}><TextField label="메모" multiline rows={2} value={form.memo||''} onChange={set('memo')} /></Grid>
      </Grid>
    </CardContent></Card>
  );
}
