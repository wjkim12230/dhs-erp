import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { useCreateEmployee } from '../hooks/useEmployees';
import type { EmployeeCreateDto } from '@dhs/shared';

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateEmployee();

  const handleSubmit = (values: EmployeeCreateDto) => {
    mutation.mutate(values, { onSuccess: () => navigate('/employees') });
  };

  return <EmployeeForm onSubmit={handleSubmit} loading={mutation.isPending} />;
}
