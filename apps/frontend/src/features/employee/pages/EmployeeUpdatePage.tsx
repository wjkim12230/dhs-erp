import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import EmployeeForm from '../components/EmployeeForm';
import { useEmployee, useUpdateEmployee } from '../hooks/useEmployees';
import type { EmployeeCreateDto } from '@dhs/shared';

export default function EmployeeUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useEmployee(Number(id));
  const mutation = useUpdateEmployee();
  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  const employee = data?.data;
  if (!employee) return null;
  const handleSubmit = (values: EmployeeCreateDto) => {
    mutation.mutate({ id: employee.id, data: { ...values, version: employee.version } }, {
      onSuccess: () => { enqueueSnackbar('수정되었습니다.', { variant: 'success' }); navigate('/employees'); },
      onError: () => enqueueSnackbar('수정에 실패했습니다.', { variant: 'error' }),
    });
  };
  return <EmployeeForm initialValues={employee} onSubmit={handleSubmit} loading={mutation.isPending} />;
}
