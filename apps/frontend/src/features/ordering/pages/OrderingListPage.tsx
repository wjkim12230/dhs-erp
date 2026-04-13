import { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Tabs, Tab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { OrderingFilter, OrderStatus } from '@dhs/shared';
import { ORDER_STATUS_LABELS } from '@dhs/shared';
import { useOrderings, useDeleteOrdering, useCompleteOrdering, useRecoverOrdering } from '../hooks/useOrderings';
import OrderingTable from '../components/OrderingTable';

export default function OrderingListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<OrderStatus>('ACTIVE');
  const [filters, setFilters] = useState<OrderingFilter>({ page:1, limit:20, status:'ACTIVE' });
  const { data, isLoading } = useOrderings(filters);
  const deleteMut = useDeleteOrdering();
  const completeMut = useCompleteOrdering();
  const recoverMut = useRecoverOrdering();

  const handleTab = (_: any, v: OrderStatus) => { setActiveTab(v); setFilters(p => ({...p, status:v, page:1})); };
  const msg = (text: string) => ({ onSuccess: () => enqueueSnackbar(text, {variant:'success'}) });

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>수주관리</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/orderings/create')}>수주 등록</Button>
      </Box>
      <Tabs value={activeTab} onChange={handleTab} sx={{ mb:2 }}>
        {(['ACTIVE','COMPLETED','DELETED'] as OrderStatus[]).map(s => <Tab key={s} value={s} label={ORDER_STATUS_LABELS[s]} />)}
      </Tabs>
      <Stack direction="row" spacing={1} sx={{ mb:2 }}>
        <TextField size="small" placeholder="고객명" onKeyDown={(e) => e.key==='Enter' && setFilters(p=>({...p, customerName:(e.target as HTMLInputElement).value, page:1}))} sx={{width:180}} />
        <TextField size="small" placeholder="수주번호" onKeyDown={(e) => e.key==='Enter' && setFilters(p=>({...p, orderNumber:(e.target as HTMLInputElement).value, page:1}))} sx={{width:160}} />
      </Stack>
      <OrderingTable data={data?.data??[]} total={data?.meta?.total??0} page={(filters.page??1)-1} pageSize={filters.limit??20} loading={isLoading} activeTab={activeTab}
        onPaginationChange={(m) => setFilters(p=>({...p, page:m.page+1, limit:m.pageSize}))}
        onDelete={(id) => deleteMut.mutate(id, msg('삭제됨'))} onComplete={(id) => completeMut.mutate(id, msg('완료 처리됨'))} onRecover={(id) => recoverMut.mutate(id, msg('복구됨'))} />
    </Box>
  );
}
