import { useState } from 'react';
import { Card, CardBody, Input, Select, SelectItem, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Employee, EmployeeCreateDto } from '@dhs/shared';
import { Position, JobGroup, Headquarter, Department, Gender, EmploymentStatus, enumToOptions, POSITION_LABELS, JOB_GROUP_LABELS, HEADQUARTER_LABELS, DEPARTMENT_LABELS, GENDER_LABELS, EMPLOYMENT_STATUS_LABELS } from '@dhs/shared';
import StickyActions from '@/components/common/StickyActions';
import DaumAddressSearch from '@/components/common/DaumAddressSearch';

interface Props { initialValues?: Employee; onSubmit: (v: EmployeeCreateDto) => void; loading?: boolean; }

export default function EmployeeForm({ initialValues, onSubmit, loading }: Props) {
  const navigate = useNavigate();
  const isEdit = !!initialValues;
  const [form, setForm] = useState<any>(initialValues ?? {});
  const set = (f: string, v: any) => setForm((p: any) => ({ ...p, [f]: v }));

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <h2 className="text-xl font-bold mb-2">{isEdit ? '직원 수정' : '직원 등록'}</h2>
        <StickyActions>
          <Button color="primary" isLoading={loading} onPress={() => onSubmit({ ...form, birthDate: form.birthDate?.slice?.(0, 10), joinDate: form.joinDate?.slice?.(0, 10) })}>{isEdit ? '수정' : '등록'}</Button>
          <Button variant="bordered" onPress={() => navigate('/employees')}>취소</Button>
        </StickyActions>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="이름" size="sm" value={form.name||''} onValueChange={(v) => set('name',v)} isRequired />
          <Input label="사번" size="sm" value={form.employeeNumber||''} onValueChange={(v) => set('employeeNumber',v)} isRequired isDisabled={isEdit} />
          <Select label="성별" size="sm" selectedKeys={form.gender ? [form.gender] : []} onSelectionChange={(k) => set('gender',[...k][0])} isRequired>
            {enumToOptions(Gender, GENDER_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Select label="직급" size="sm" selectedKeys={form.position ? [form.position] : []} onSelectionChange={(k) => set('position',[...k][0])} isRequired>
            {enumToOptions(Position, POSITION_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Select label="직군" size="sm" selectedKeys={form.jobGroup ? [form.jobGroup] : []} onSelectionChange={(k) => set('jobGroup',[...k][0])} isRequired>
            {enumToOptions(JobGroup, JOB_GROUP_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Select label="본부" size="sm" selectedKeys={form.headquarter ? [form.headquarter] : []} onSelectionChange={(k) => set('headquarter',[...k][0])} isRequired>
            {enumToOptions(Headquarter, HEADQUARTER_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Select label="부서" size="sm" selectedKeys={form.department ? [form.department] : []} onSelectionChange={(k) => set('department',[...k][0])} isRequired>
            {enumToOptions(Department, DEPARTMENT_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Select label="재직상태" size="sm" selectedKeys={[form.employmentStatus||'ACTIVE']} onSelectionChange={(k) => set('employmentStatus',[...k][0])}>
            {enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
          </Select>
          <Input label="급여" size="sm" type="number" value={form.salary?.toString()||''} onValueChange={(v) => set('salary',+v)} />
          <Input label="연락처" size="sm" value={form.contact||''} onValueChange={(v) => set('contact',v)} />
          <Input label="내선번호" size="sm" value={form.internalNumber||''} onValueChange={(v) => set('internalNumber',v)} />
          <Input label="생년월일" size="sm" type="date" value={form.birthDate?.slice?.(0,10)||''} onValueChange={(v) => set('birthDate',v)} />
          <Input label="입사일" size="sm" type="date" value={form.joinDate?.slice?.(0,10)||''} onValueChange={(v) => set('joinDate',v)} />
          <div className="sm:col-span-2"><DaumAddressSearch value={form.address} onChange={(v) => set('address',v)} /></div>
          <div className="sm:col-span-2 lg:col-span-3">
            <textarea className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30" rows={3} placeholder="메모" value={form.memo||''} onChange={(e) => set('memo',e.target.value)} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
