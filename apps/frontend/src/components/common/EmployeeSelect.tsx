import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import type { Employee } from '@dhs/shared';

interface EmployeeSelectProps extends Omit<SelectProps, 'options'> {
  department?: string;
}

export default function EmployeeSelect({ department, ...props }: EmployeeSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['employees', 'select', department],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '200', employmentStatus: 'ACTIVE' });
      if (department) params.set('department', department);
      const res = await apiClient.get(`/employees?${params}`);
      return res.data.data as Employee[];
    },
  });

  return (
    <Select
      showSearch
      allowClear
      placeholder="직원 선택"
      loading={isLoading}
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      options={data?.map((emp) => ({
        label: `${emp.name} (${emp.employeeNumber})`,
        value: emp.id,
      }))}
      {...props}
    />
  );
}
