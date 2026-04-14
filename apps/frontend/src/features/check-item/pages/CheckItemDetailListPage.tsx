import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@heroui/react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCheckItemDetails, useCreateCheckItemDetail, useDeleteCheckItemDetail } from '../hooks/useCheckItems';
import DataTable from '@/components/common/DataTable';

export default function CheckItemDetailListPage() {
  const { checkItemId } = useParams<{ checkItemId: string }>();
  const cid = Number(checkItemId);
  const { data, isLoading } = useCheckItemDetails(cid);
  const createMut = useCreateCheckItemDetail(cid);
  const deleteMut = useDeleteCheckItemDetail(cid);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ name: '', priority: 0 });
  const columns = [
    { key: 'name', label: '상세명' },
    { key: 'priority', label: '우선순위', width: 90 },
    { key: 'actions', label: '', width: 60, render: (_: any, r: any) => <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip> },
  ];
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">검사항목 상세</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => { setForm({name:'',priority:0}); onOpen(); }}>추가</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.data?.length??0} page={1} pageSize={100} loading={isLoading} />
      <Modal isOpen={isOpen} onClose={onClose}><ModalContent>
        <ModalHeader>상세 추가</ModalHeader>
        <ModalBody className="gap-3">
          <Input label="상세명" size="sm" value={form.name} onValueChange={(v) => setForm(p=>({...p,name:v}))} />
          <Input label="우선순위" size="sm" type="number" value={form.priority.toString()} onValueChange={(v) => setForm(p=>({...p,priority:+v}))} />
        </ModalBody>
        <ModalFooter><Button variant="bordered" onPress={onClose}>취소</Button><Button color="primary" onPress={() => createMut.mutate(form, { onSuccess: () => { onClose(); toast.success('등록됨'); } })}>저장</Button></ModalFooter>
      </ModalContent></Modal>
    </div>
  );
}
