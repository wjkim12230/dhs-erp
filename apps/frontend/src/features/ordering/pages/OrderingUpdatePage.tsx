import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import { useOrdering, useUpdateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import StickyActions from '@/components/common/StickyActions';

export default function OrderingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useOrdering(Number(id));
  const mutation = useUpdateOrdering();
  const [form, setForm] = useState<any>({});
  const set = (f: string, v: any) => setForm((p: any) => ({...p, [f]: v}));
  useEffect(() => { if (data?.data) setForm(data.data); }, [data]);
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-2">수주 수정</h2>
      <StickyActions>
        <Button color="primary" isLoading={mutation.isPending} onPress={() => mutation.mutate({ id: +id!, data: {...form, version: form.version} }, { onSuccess: () => { toast.success('수정됨'); navigate('/orderings'); } })}>수정</Button>
        <Button variant="bordered" onPress={() => navigate('/orderings')}>취소</Button>
      </StickyActions>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="고객명" size="sm" value={form.customerName||''} onValueChange={(v) => set('customerName',v)} isRequired />
        <Input label="수주번호" size="sm" value={form.orderNumber||''} isDisabled />
        <Input label="현장명" size="sm" value={form.siteName||''} onValueChange={(v) => set('siteName',v)} />
        <Input label="발주자" size="sm" value={form.orderer||''} onValueChange={(v) => set('orderer',v)} />
        <Input label="연락처" size="sm" value={form.customerContact||''} onValueChange={(v) => set('customerContact',v)} />
        <Input label="수량" size="sm" value={form.quantity||''} onValueChange={(v) => set('quantity',v)} />
        <Input label="수주일" size="sm" type="date" value={form.orderDate?.slice?.(0,10)||''} onValueChange={(v) => set('orderDate',v)} />
        <Input label="납기일" size="sm" type="date" value={form.dueDate?.slice?.(0,10)||''} onValueChange={(v) => set('dueDate',v)} />
        <Input label="출하예정일" size="sm" type="date" value={form.expectedDeliveryDate?.slice?.(0,10)||''} onValueChange={(v) => set('expectedDeliveryDate',v)} />
        <EmployeeSelect label="수주담당" value={form.orderEmployeeId} onChange={(v) => set('orderEmployeeId',v)} />
        <EmployeeSelect label="접수담당" value={form.receiptEmployeeId} onChange={(v) => set('receiptEmployeeId',v)} />
        <EmployeeSelect label="포장담당" value={form.packagingEmployeeId} onChange={(v) => set('packagingEmployeeId',v)} />
        <div className="sm:col-span-2 lg:col-span-3">
          <textarea className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none" rows={2} placeholder="메모" value={form.memo||''} onChange={(e) => set('memo',e.target.value)} />
        </div>
      </div>
    </CardBody></Card>
  );
}
