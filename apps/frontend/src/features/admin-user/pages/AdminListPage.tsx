import { useState } from 'react';
import { Button, Tooltip, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, useDisclosure } from '@heroui/react';
import { Plus, Trash2, KeyRound } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '../api/adminApi';
import { Role, enumToOptions, ROLE_LABELS } from '@dhs/shared';
import type { PaginationParams } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';

export default function AdminListPage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useQuery({ queryKey: ['admins', filters], queryFn: () => adminApi.getList(filters) });
  const createMut = useMutation({ mutationFn: adminApi.create, onSuccess: () => { qc.invalidateQueries({queryKey:['admins']}); toast.success('등록됨'); } });
  const deleteMut = useMutation({ mutationFn: adminApi.delete, onSuccess: () => { qc.invalidateQueries({queryKey:['admins']}); toast.success('삭제됨'); } });
  const resetMut = useMutation({ mutationFn: ({id,pw}:{id:number;pw:string}) => adminApi.resetPassword(id,pw), onSuccess: () => toast.success('비밀번호 초기화됨') });

  const { isOpen: createOpen, onOpen: openCreate, onClose: closeCreate } = useDisclosure();
  const [resetTarget, setResetTarget] = useState<number|null>(null);
  const [createForm, setCreateForm] = useState<any>({});
  const [resetPw, setResetPw] = useState('');

  const columns = [
    { key: 'loginId', label: '아이디' },
    { key: 'name', label: '이름' },
    { key: 'role', label: '권한', width: 100, render: (v: string) => <Chip size="sm" variant="flat">{ROLE_LABELS[v as keyof typeof ROLE_LABELS]}</Chip> },
    { key: 'isEnabled', label: '활성', width: 70, render: (v: boolean) => <Chip size="sm" color={v?'success':'default'} variant="flat">{v?'활성':'비활성'}</Chip> },
    { key: 'actions', label: '', width: 100, render: (_: any, r: any) => (
      <div className="flex gap-1">
        <Tooltip content="비밀번호"><Button isIconOnly size="sm" variant="light" onPress={() => { setResetPw(''); setResetTarget(r.id); }}><KeyRound size={14} /></Button></Tooltip>
        <Tooltip content="삭제"><Button isIconOnly size="sm" variant="light" color="danger" onPress={() => { if(confirm('삭제?')) deleteMut.mutate(r.id); }}><Trash2 size={14} /></Button></Tooltip>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">관리자</h1>
        <Button color="primary" startContent={<Plus size={16} />} onPress={() => { setCreateForm({}); openCreate(); }}>관리자 추가</Button>
      </div>
      <DataTable columns={columns} rows={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))} />

      <Modal isOpen={createOpen} onClose={closeCreate}><ModalContent>
        <ModalHeader>관리자 추가</ModalHeader>
        <ModalBody className="gap-3">
          <Input label="아이디" size="sm" value={createForm.loginId||''} onValueChange={(v) => setCreateForm((p: any)=>({...p,loginId:v}))} />
          <Input label="이름" size="sm" value={createForm.name||''} onValueChange={(v) => setCreateForm((p: any)=>({...p,name:v}))} />
          <Input label="비밀번호" size="sm" type="password" value={createForm.password||''} onValueChange={(v) => setCreateForm((p: any)=>({...p,password:v}))} />
          <Select label="권한" size="sm" selectedKeys={createForm.role ? [createForm.role] : []} onSelectionChange={(k) => setCreateForm((p: any)=>({...p,role:[...k][0]}))}>
            {enumToOptions(Role, ROLE_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
        </ModalBody>
        <ModalFooter><Button variant="bordered" onPress={closeCreate}>취소</Button><Button color="primary" onPress={() => createMut.mutate(createForm, { onSuccess: closeCreate })}>저장</Button></ModalFooter>
      </ModalContent></Modal>

      <Modal isOpen={resetTarget !== null} onClose={() => setResetTarget(null)}><ModalContent>
        <ModalHeader>비밀번호 초기화</ModalHeader>
        <ModalBody><Input label="새 비밀번호" size="sm" type="password" value={resetPw} onValueChange={setResetPw} /></ModalBody>
        <ModalFooter><Button variant="bordered" onPress={() => setResetTarget(null)}>취소</Button><Button color="primary" onPress={() => resetMut.mutate({id:resetTarget!,pw:resetPw}, { onSuccess: () => setResetTarget(null) })}>초기화</Button></ModalFooter>
      </ModalContent></Modal>
    </div>
  );
}
