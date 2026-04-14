import { useState } from 'react';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { Plus, Trash2, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';
import type { PaginationParams, Model } from '@dhs/shared';
import { useCheckItems, useCreateCheckItem, useDeleteCheckItem } from '../hooks/useCheckItems';
import DataTable from '@/components/common/DataTable';

export default function CheckItemListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useCheckItems(filters);
  const createMut = useCreateCheckItem();
  const deleteMut = useDeleteCheckItem();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<any>({ name: '', modelId: '', priority: 0 });
  const { data: models } = useQuery({ queryKey: ['models','s'], queryFn: async () => { const r = await apiClient.get('/models?limit=200'); return r.data.data as Model[]; } });
  const columns = [
    { key: 'name', label: '검사항목명' },
    { key: 'priority', label: '우선순위', width: 90 },
    { key: 'actions', label: '', width: 100, render: (_: any, r: any) => (
      <div className="flex gap-1">
        <Tooltip content="상세"><Button isIconOnly size="sm" variant="light" onPress={() => navigate(`/check-items/${r.id}/details`)}><List size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )},
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">검사항목</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => { setForm({name:'',modelId:'',priority:0}); onOpen(); }}>추가</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))} />
      <Modal isOpen={isOpen} onClose={onClose}><ModalContent>
        <ModalHeader>검사항목 추가</ModalHeader>
        <ModalBody className="gap-3">
          <Input label="항목명" size="sm" value={form.name} onValueChange={(v) => setForm((p: any)=>({...p,name:v}))} />
          <Select label="모델" size="sm" selectedKeys={form.modelId ? [form.modelId.toString()] : []} onSelectionChange={(k) => setForm((p: any)=>({...p,modelId:+[...k][0]}))}>
            {(models??[]).map(m => <SelectItem key={m.id.toString()}>{m.name}</SelectItem>)}
          </Select>
          <Input label="우선순위" size="sm" type="number" value={form.priority.toString()} onValueChange={(v) => setForm((p: any)=>({...p,priority:+v}))} />
        </ModalBody>
        <ModalFooter><Button variant="bordered" onPress={onClose}>취소</Button><Button color="primary" onPress={() => createMut.mutate(form, { onSuccess: () => { onClose(); toast.success('등록됨'); } })}>저장</Button></ModalFooter>
      </ModalContent></Modal>
    </div>
  );
}
