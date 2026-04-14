import { useState } from 'react';
import { Card, CardBody, Input, Select, SelectItem, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import type { Model, ModelCreateDto } from '@dhs/shared';
import { Department, enumToOptions, DEPARTMENT_LABELS } from '@dhs/shared';
import { useModelGroups } from '../hooks/useModels';
import StickyActions from '@/components/common/StickyActions';

interface Props { initialValues?: Model; onSubmit: (v: ModelCreateDto) => void; loading?: boolean; }

export default function ModelForm({ initialValues, onSubmit, loading }: Props) {
  const navigate = useNavigate();
  const { data: groups } = useModelGroups({ limit: 100 });
  const isEdit = !!initialValues;
  const [form, setForm] = useState<any>(initialValues ?? {});
  const set = (f: string, v: any) => setForm((p: any) => ({...p, [f]: v}));

  return (
    <Card className="w-full"><CardBody className="p-6">
      <h2 className="text-xl font-bold mb-2">{isEdit ? '모델 수정' : '모델 등록'}</h2>
      <StickyActions>
        <Button color="primary" isLoading={loading} onPress={() => onSubmit(form)}>{isEdit ? '수정' : '등록'}</Button>
        <Button variant="bordered" onPress={() => navigate('/models')}>취소</Button>
      </StickyActions>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="모델명" size="sm" value={form.name||''} onValueChange={(v) => set('name',v)} isRequired />
        <Input label="수주명" size="sm" value={form.orderingName||''} onValueChange={(v) => set('orderingName',v)} />
        <Select label="모델그룹" size="sm" selectedKeys={form.modelGroupId ? [form.modelGroupId.toString()] : []} onSelectionChange={(k) => set('modelGroupId',+[...k][0])} isRequired>
          {(groups?.data??[]).map(g => <SelectItem key={g.id.toString()}>{g.name}</SelectItem>)}
        </Select>
        <Input label="우선순위" size="sm" type="number" value={form.priority?.toString()||''} onValueChange={(v) => set('priority',+v)} />
      </div>
    </CardBody></Card>
  );
}
