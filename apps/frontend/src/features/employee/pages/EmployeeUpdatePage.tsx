import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import type { EmployeeCreateDto } from '@dhs/shared';

export default function EmployeeUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useEmployee(Number(id));
  const mutation = useUpdateEmployee();
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  const emp = data?.data;
  if (!emp) return null;
  return <EmployeeForm initialValues={emp} onSubmit={(v: EmployeeCreateDto) => mutation.mutate({ id: emp.id, data: {...v, version: emp.version} }, { onSuccess: () => { toast.success('수정됨'); navigate('/employees'); }, onError: () => toast.error('수정 실패') })} loading={mutation.isPending} />;
}
