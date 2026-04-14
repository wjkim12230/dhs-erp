import { useState } from 'react';
import { Card, CardBody, Input, Select, SelectItem, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';
import { useCreateSpecification } from '../hooks/useSpecifications';
import StickyActions from '@/components/common/StickyActions';
import type { Model } from '@dhs/shared';

export default function SpecificationCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateSpecification();
  const [form, setForm] = useState<any>({});
  const { data: models } = useQuery({ queryKey: ['models','s'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-2">사양 등록</h2>
      <StickyActions>
        <Button color="primary" onPress={() => mutation.mutate(form, { onSuccess: () => { toast.success('등록됨'); navigate('/specifications'); } })}>등록</Button>
        <Button variant="bordered" onPress={() => navigate('/specifications')}>취소</Button>
      </StickyActions>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Input label="사양명" size="sm" value={form.name||''} onValueChange={(v) => setForm((p: any)=>({...p,name:v}))} isRequired />
        <Input label="우선순위" size="sm" type="number" value={form.priority?.toString()||''} onValueChange={(v) => setForm((p: any)=>({...p,priority:+v}))} />
        <div className="sm:col-span-2">
          <Select label="모델" size="sm" selectedKeys={form.modelId ? [form.modelId.toString()] : []} onSelectionChange={(k) => setForm((p: any)=>({...p,modelId:+[...k][0]}))} isRequired>
            {(models??[]).map(m => <SelectItem key={m.id.toString()}>{m.name}</SelectItem>)}
          </Select>
        </div>
      </div>
    </CardBody></Card>
  );
}
