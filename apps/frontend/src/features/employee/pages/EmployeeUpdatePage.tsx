import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import type { EmployeeCreateDto } from '@dhs/shared';

export default function EmployeeUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useEmployee(Number(id));
  const mutation = useUpdateEmployee();

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const employee = data?.data;
  if (!employee) return null;

  const handleSubmit = (values: EmployeeCreateDto) => {
    mutation.mutate(
      { id: employee.id, data: { ...values, version: employee.version } },
      { onSuccess: () => navigate('/employees') },
    );
  };

  return <EmployeeForm initialValues={employee} onSubmit={handleSubmit} loading={mutation.isPending} />;
}
