import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Select, SelectItem, Chip } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';
import { useOrderingWizardStore } from '@/stores/orderingWizardStore';
import { useCreateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import type { Model } from '@dhs/shared';

const STEPS = ['기본정보', '모델선택', '사양선택', '검사항목', '담당자배정'];

export default function OrderingCreatePage() {
  const navigate = useNavigate();
  const store = useOrderingWizardStore();
  const createMut = useCreateOrdering();
  const [form, setForm] = useState<any>({});
  const set = (f: string, v: any) => setForm((p: any) => ({...p, [f]: v}));

  useEffect(() => { store.reset(); }, []);
  const { data: modelsData } = useQuery({ queryKey: ['models','all'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  const { data: modelDetail } = useQuery({ queryKey: ['models', store.selectedModel?.id], queryFn: async () => { const r = await apiClient.get(`/models/${store.selectedModel!.id}`); return r.data.data as Model; }, enabled: !!store.selectedModel?.id });

  const handleSubmit = () => {
    store.setFormData(form);
    const dto = store.buildCreateDto();
    createMut.mutate(dto, { onSuccess: () => { store.reset(); toast.success('수주 등록됨'); navigate('/orderings'); } });
  };

  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-4">수주 등록</h2>
      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${i === store.currentStep ? 'bg-brand text-white' : i < store.currentStep ? 'bg-brand-100 text-brand' : 'bg-gray-100 text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{i + 1}</span> {s}
          </div>
        ))}
      </div>

      {store.currentStep === 0 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="고객명" size="sm" value={form.customerName||''} onValueChange={(v) => set('customerName',v)} isRequired />
            <Input label="수주번호" size="sm" value={form.orderNumber||''} onValueChange={(v) => set('orderNumber',v)} isRequired />
            <Input label="현장명" size="sm" value={form.siteName||''} onValueChange={(v) => set('siteName',v)} />
            <Input label="발주자" size="sm" value={form.orderer||''} onValueChange={(v) => set('orderer',v)} />
            <Input label="연락처" size="sm" value={form.customerContact||''} onValueChange={(v) => set('customerContact',v)} />
            <Input label="수량" size="sm" value={form.quantity||''} onValueChange={(v) => set('quantity',v)} />
            <Input label="수주일" size="sm" type="date" value={form.orderDate||''} onValueChange={(v) => set('orderDate',v)} />
            <Input label="납기일" size="sm" type="date" value={form.dueDate||''} onValueChange={(v) => set('dueDate',v)} />
            <Input label="출하예정일" size="sm" type="date" value={form.expectedDeliveryDate||''} onValueChange={(v) => set('expectedDeliveryDate',v)} />
            <div className="sm:col-span-2 lg:col-span-3">
              <textarea className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none" rows={2} placeholder="메모" value={form.memo||''} onChange={(e) => set('memo',e.target.value)} />
            </div>
          </div>
          <Button color="primary" className="mt-4" onPress={() => { store.setFormData(form); store.nextStep(); }}>다음</Button>
        </div>
      )}

      {store.currentStep === 1 && (
        <div>
          <p className="text-sm text-gray-600 mb-3">모델을 선택하세요</p>
          <div className="flex flex-wrap gap-2">
            {modelsData?.map(m => (
              <Chip key={m.id} variant={store.selectedModel?.id === m.id ? 'solid' : 'bordered'} color={store.selectedModel?.id === m.id ? 'primary' : 'default'}
                className="cursor-pointer px-4 py-2" onClick={() => store.setModel(m)}>{m.name}{m.orderingName ? ` (${m.orderingName})` : ''}</Chip>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="bordered" onPress={store.prevStep}>이전</Button>
            <Button color="primary" isDisabled={!store.selectedModel} onPress={store.nextStep}>다음</Button>
          </div>
        </div>
      )}

      {store.currentStep === 2 && (
        <div>
          <p className="text-sm text-gray-600 mb-3">사양 선택</p>
          {modelDetail?.specifications?.map(spec => (
            <Card key={spec.id} className="mb-2"><CardBody className="p-3">
              <p className="text-sm font-semibold mb-2">{spec.name}</p>
              <Select size="sm" selectedKeys={(() => { const f = store.selectedSpecs.find(s => s.specificationId === spec.id); return f?.specificationDetailId ? [f.specificationDetailId.toString()] : []; })()}
                onSelectionChange={(k) => { const newSpecs = store.selectedSpecs.filter(s => s.specificationId !== spec.id); const v = [...k][0]; if(v) newSpecs.push({specificationId:spec.id,specificationDetailId:+v}); store.setSpecs(newSpecs); }}>
                {(spec.specificationDetails??[]).map(d => <SelectItem key={d.id.toString()}>{d.name}</SelectItem>)}
              </Select>
            </CardBody></Card>
          ))}
          <div className="flex gap-2 mt-4"><Button variant="bordered" onPress={store.prevStep}>이전</Button><Button color="primary" onPress={store.nextStep}>다음</Button></div>
        </div>
      )}

      {store.currentStep === 3 && (
        <div>
          <p className="text-sm text-gray-600 mb-3">검사항목</p>
          {modelDetail?.checkItems?.map(ci => (
            <Card key={ci.id} className="mb-2"><CardBody className="p-3">
              <p className="text-sm font-semibold mb-2">{ci.name}</p>
              <div className="flex flex-wrap gap-1.5">
                {ci.checkItemDetails?.map(d => {
                  const checked = store.selectedChecks.some(c => c.checkItemDetailId === d.id);
                  return <Chip key={d.id} size="sm" variant={checked ? 'solid' : 'bordered'} color={checked ? 'primary' : 'default'} className="cursor-pointer"
                    onClick={() => { if(checked) store.setChecks(store.selectedChecks.filter(c=>c.checkItemDetailId!==d.id)); else store.setChecks([...store.selectedChecks,{checkItemDetailId:d.id}]); }}>{d.name}</Chip>;
                })}
              </div>
            </CardBody></Card>
          ))}
          <div className="flex gap-2 mt-4"><Button variant="bordered" onPress={store.prevStep}>이전</Button><Button color="primary" onPress={store.nextStep}>다음</Button></div>
        </div>
      )}

      {store.currentStep === 4 && (
        <div>
          <p className="text-sm text-gray-600 mb-3">담당자 배정</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmployeeSelect label="수주 담당자" value={form.orderEmployeeId} onChange={(v) => set('orderEmployeeId',v)} />
            <EmployeeSelect label="접수 담당자" value={form.receiptEmployeeId} onChange={(v) => set('receiptEmployeeId',v)} />
            <EmployeeSelect label="포장 담당자" value={form.packagingEmployeeId} onChange={(v) => set('packagingEmployeeId',v)} />
            <EmployeeSelect label="출하 담당자" value={form.shippingEmployeeId} onChange={(v) => set('shippingEmployeeId',v)} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="bordered" onPress={store.prevStep}>이전</Button>
            <Button color="primary" isLoading={createMut.isPending} onPress={handleSubmit}>등록</Button>
          </div>
        </div>
      )}
    </CardBody></Card>
  );
}
