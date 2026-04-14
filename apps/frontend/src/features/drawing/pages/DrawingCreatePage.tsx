import { useState } from 'react';
import { Card, CardBody, Input, Select, SelectItem, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';
import { useCreateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';
import StickyActions from '@/components/common/StickyActions';
import type { Model } from '@dhs/shared';

export default function DrawingCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateDrawing();
  const [form, setForm] = useState<any>({});
  const { data: models } = useQuery({ queryKey: ['models','s'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-2">도면 등록</h2>
      <StickyActions>
        <Button color="primary" onPress={() => mutation.mutate(form, { onSuccess: () => { toast.success('등록됨'); navigate('/drawings'); } })}>등록</Button>
        <Button variant="bordered" onPress={() => navigate('/drawings')}>취소</Button>
      </StickyActions>
      <div className="space-y-4 max-w-xl">
        <ImageUpload value={form.imageUrl} onChange={(url) => setForm((p: any) => ({...p, imageUrl: url}))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="길이수" size="sm" type="number" value={form.lengthCount?.toString()||''} onValueChange={(v) => setForm((p: any) => ({...p, lengthCount: +v}))} />
          <Select label="모델" size="sm" selectedKeys={form.modelId ? [form.modelId.toString()] : []} onSelectionChange={(k) => setForm((p: any)=>({...p,modelId:+[...k][0]}))} isRequired>
            {(models??[]).map(m => <SelectItem key={m.id.toString()}>{m.name}</SelectItem>)}
          </Select>
        </div>
      </div>
    </CardBody></Card>
  );
}
