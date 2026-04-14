import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@heroui/react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useModelDetails, useCreateModelDetail, useDeleteModelDetail } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelDetailListPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const mid = Number(modelId);
  const { data, isLoading } = useModelDetails(mid);
  const createMut = useCreateModelDetail(mid);
  const deleteMut = useDeleteModelDetail(mid);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ name: '', priority: 0 });

  const columns = [
    { key: 'name', label: '상세항목명' },
    { key: 'priority', label: '우선순위', width: 100 },
    { key: 'actions', label: '', width: 60, render: (_: any, r: any) => (
      <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip>
    )},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">모델 상세항목</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => { setForm({ name: '', priority: 0 }); onOpen(); }}>추가</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.data?.length??0} page={1} pageSize={100} loading={isLoading} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>상세항목 추가</ModalHeader>
          <ModalBody>
            <Input label="항목명" size="sm" value={form.name} onValueChange={(v) => setForm(p => ({...p, name: v}))} />
            <Input label="우선순위" size="sm" type="number" value={form.priority.toString()} onValueChange={(v) => setForm(p => ({...p, priority: +v}))} />
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose}>취소</Button>
            <Button color="primary" onPress={() => createMut.mutate(form, { onSuccess: () => { onClose(); toast.success('등록됨'); } })}>저장</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
