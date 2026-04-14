import { useState } from 'react';
import { Input, Button, Tabs, Tab } from '@heroui/react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { OrderingFilter, OrderStatus } from '@dhs/shared';
import { ORDER_STATUS_LABELS } from '@dhs/shared';
import { useOrderings, useDeleteOrdering, useCompleteOrdering, useRecoverOrdering } from '../hooks/useOrderings';
import OrderingTable from '../components/OrderingTable';

export default function OrderingListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus>('ACTIVE');
  const [filters, setFilters] = useState<OrderingFilter>({ page: 1, limit: 20, status: 'ACTIVE' });
  const { data, isLoading } = useOrderings(filters);
  const deleteMut = useDeleteOrdering();
  const completeMut = useCompleteOrdering();
  const recoverMut = useRecoverOrdering();

  const handleTab = (key: any) => { const s = key as OrderStatus; setActiveTab(s); setFilters(p => ({...p, status: s, page: 1})); };
  const msg = (t: string) => ({ onSuccess: () => toast.success(t) });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">수주관리</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => navigate('/orderings/create')}>수주 등록</Button>
      </div>
      <Tabs selectedKey={activeTab} onSelectionChange={handleTab} className="mb-4">
        {(['ACTIVE','COMPLETED','DELETED'] as OrderStatus[]).map(s => <Tab key={s} title={ORDER_STATUS_LABELS[s]} />)}
      </Tabs>
      <div className="flex gap-2 mb-4">
        <Input size="sm" placeholder="고객명" className="w-44" onKeyDown={(e: any) => e.key==='Enter' && setFilters(p=>({...p, customerName: e.target.value, page:1}))} />
        <Input size="sm" placeholder="수주번호" className="w-40" onKeyDown={(e: any) => e.key==='Enter' && setFilters(p=>({...p, orderNumber: e.target.value, page:1}))} />
      </div>
      <OrderingTable data={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading} activeTab={activeTab}
        onPageChange={(p) => setFilters(prev=>({...prev,page:p}))} onPageSizeChange={(s) => setFilters(prev=>({...prev,limit:s,page:1}))}
        onDelete={(id) => deleteMut.mutate(id, msg('삭제됨'))} onComplete={(id) => completeMut.mutate(id, msg('완료'))} onRecover={(id) => recoverMut.mutate(id, msg('복구됨'))} />
    </div>
  );
}
