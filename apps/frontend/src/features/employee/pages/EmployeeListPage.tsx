import { useState } from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Department, EmploymentStatus, Headquarter, enumToOptions, DEPARTMENT_LABELS, EMPLOYMENT_STATUS_LABELS, HEADQUARTER_LABELS } from '@dhs/shared';
import type { EmployeeFilter } from '@dhs/shared';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import { useAuthStore } from '@/stores/authStore';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const [filters, setFilters] = useState<EmployeeFilter>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useEmployees(filters);
  const deleteMut = useDeleteEmployee();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">직원관리</h1>
        {hasRole('SUPER','ADMIN') && <Button color="primary" startContent={<Plus size={16} />} onPress={() => navigate('/employees/create')}>직원 등록</Button>}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Input size="sm" placeholder="이름 검색" className="w-44" value={search} onValueChange={setSearch} endContent={<Search size={14} className="text-gray-400 cursor-pointer" onClick={() => setFilters(p => ({...p, name: search, page: 1}))} />}
          onKeyDown={(e: any) => e.key === 'Enter' && setFilters(p => ({...p, name: search, page: 1}))} />
        <Select size="sm" label="부서" className="w-36" selectedKeys={filters.department ? [filters.department] : []} onSelectionChange={(k) => setFilters(p => ({...p, department: [...k][0] as any, page: 1}))}>
          {enumToOptions(Department, DEPARTMENT_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
        </Select>
        <Select size="sm" label="본부" className="w-36" selectedKeys={filters.headquarter ? [filters.headquarter] : []} onSelectionChange={(k) => setFilters(p => ({...p, headquarter: [...k][0] as any, page: 1}))}>
          {enumToOptions(Headquarter, HEADQUARTER_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
        </Select>
        <Select size="sm" label="재직상태" className="w-28" selectedKeys={filters.employmentStatus ? [filters.employmentStatus] : []} onSelectionChange={(k) => setFilters(p => ({...p, employmentStatus: [...k][0] as any, page: 1}))}>
          {enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS).map(o => <SelectItem key={o.value}>{o.label}</SelectItem>)}
        </Select>
      </div>
      <EmployeeTable data={data?.data??[]} total={data?.meta?.total??0} page={filters.page??1} pageSize={filters.limit??20} loading={isLoading}
        onPageChange={(p) => setFilters(prev => ({...prev, page: p}))} onPageSizeChange={(s) => setFilters(prev => ({...prev, limit: s, page: 1}))}
        onDelete={(id) => deleteMut.mutate(id, { onSuccess: () => toast.success('삭제됨') })} />
    </div>
  );
}
