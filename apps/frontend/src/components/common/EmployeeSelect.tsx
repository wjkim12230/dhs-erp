import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import type { Employee } from '@dhs/shared';

interface EmployeeSelectProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  label?: string;
  department?: string;
}

export default function EmployeeSelect({ value, onChange, label = '직원 선택', department }: EmployeeSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['employees', 'select', department],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '200', employmentStatus: 'ACTIVE' });
      if (department) params.set('department', department);
      const res = await apiClient.get(`/employees?${params}`);
      return res.data.data as Employee[];
    },
  });

  const options = data ?? [];
  const selected = options.find((e) => e.id === value) ?? null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(o) => `${o.name} (${o.employeeNumber})`}
      value={selected}
      onChange={(_, v) => onChange?.(v?.id ?? null)}
      loading={isLoading}
      size="small"
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
