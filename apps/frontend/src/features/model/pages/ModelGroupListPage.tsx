import { useState } from 'react';
import { Button, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@heroui/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ModelGroup, PaginationParams } from '@dhs/shared';
import { useModelGroups, useCreateModelGroup, useUpdateModelGroup, useDeleteModelGroup } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

export default function ModelGroupListPage() {
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModelGroups(filters);
  const createMut = useCreateModelGroup();
  const updateMut = useUpdateModelGroup();
  const deleteMut = useDeleteModelGroup();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<ModelGroup | null>(null);
  const [form, setForm] = useState({ name: '', priority: 0 });

  const openCreate = () => { setEditing(null); setForm({ name: '', priority: 0 }); onOpen(); };
  const openEdit = (g: ModelGroup) => { setEditing(g); setForm({ name: g.name, priority: g.priority }); onOpen(); };
  const handleSave = () => {
    if (editing) updateMut.mutate({ id: editing.id, data: { ...form, version: editing.version } }, { onSuccess: () => { onClose(); toast.success('수정됨'); } });
    else createMut.mutate(form, { onSuccess: () => { onClose(); toast.success('등록됨'); } });
  };

  const columns = [
    { key: 'name', label: '그룹명' },
    { key: 'priority', label: '우선순위', width: 100 },
    { key: 'models', label: '모델 수', width: 100, render: (_: any, r: any) => r.models?.length ?? 0 },
    { key: 'actions', label: '', width: 100, render: (_: any, r: ModelGroup) => (
      <div className="flex gap-1">
        <Tooltip content="수정"><Button isIconOnly size="sm" variant="light" onPress={() => openEdit(r)}><Edit size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id, { onSuccess: () => toast.success('삭제됨') }); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">모델그룹</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={openCreate}>그룹 추가</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editing ? '그룹 수정' : '그룹 추가'}</ModalHeader>
          <ModalBody>
            <Input label="그룹명" size="sm" value={form.name} onValueChange={(v) => setForm(p => ({...p, name: v}))} />
            <Input label="우선순위" size="sm" type="number" value={form.priority.toString()} onValueChange={(v) => setForm(p => ({...p, priority: +v}))} />
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose}>취소</Button>
            <Button color="primary" onPress={handleSave}>저장</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
