import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button, Switch } from '@heroui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '@/services/apiClient';
import type { AppSettings } from '@dhs/shared';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: async () => { const r = await apiClient.get('/settings'); return r.data.data as AppSettings; } });
  const mutation = useMutation({ mutationFn: async (v: Partial<AppSettings>) => { await apiClient.patch('/settings', v); }, onSuccess: () => { qc.invalidateQueries({queryKey:['settings']}); toast.success('저장됨'); } });
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  if (isLoading) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">앱 설정</h1>
      <Card className="w-full"><CardBody className="p-6 space-y-4">
        <Input label="기본 언어" size="sm" value={form.defaultLocale||''} onValueChange={(v) => setForm((p: any)=>({...p,defaultLocale:v}))} />
        <Switch isSelected={form.international||false} onValueChange={(v) => setForm((p: any)=>({...p,international:v}))}>국제화 모드</Switch>
        <Input label="마지막 수주번호" size="sm" type="number" value={form.lastOrderNumber?.toString()||'0'} onValueChange={(v) => setForm((p: any)=>({...p,lastOrderNumber:+v}))} />
        <Button color="primary" isLoading={mutation.isPending} onPress={() => mutation.mutate(form)}>저장</Button>
      </CardBody></Card>
    </div>
  );
}
