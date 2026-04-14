import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import type { Employee } from '@dhs/shared';

interface Props { value?: number | null; onChange?: (v: number | null) => void; label?: string; }

export default function EmployeeSelect({ value, onChange, label = '직원 선택' }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['employees', 'select'],
    queryFn: async () => { const r = await apiClient.get('/employees?limit=200&employmentStatus=ACTIVE'); return r.data.data as Employee[]; },
  });

  return (
    <Autocomplete label={label} size="sm" isLoading={isLoading}
      selectedKey={value?.toString() ?? ''}
      onSelectionChange={(key) => onChange?.(key ? +key : null)}
      defaultItems={data ?? []}>
      {(emp: Employee) => <AutocompleteItem key={emp.id.toString()}>{emp.name} ({emp.employeeNumber})</AutocompleteItem>}
    </Autocomplete>
  );
}
