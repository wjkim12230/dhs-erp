import { Card, Form, Input, Switch, InputNumber, Button, Typography, message, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import type { AppSettings } from '@dhs/shared';

const { Title } = Typography;

export default function SettingsPage() {
  const qc = useQueryClient();
  const [form] = Form.useForm();
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => { const res = await apiClient.get('/settings'); return res.data.data as AppSettings; },
  });

  const mutation = useMutation({
    mutationFn: async (values: Partial<AppSettings>) => { await apiClient.patch('/settings', values); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); message.success('설정이 저장되었습니다.'); },
  });

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <>
      <Title level={4} style={{ marginBottom: 24 }}>앱 설정</Title>
      <Card style={{ maxWidth: 500 }}>
        <Form form={form} layout="vertical" initialValues={data} onFinish={(v) => mutation.mutate(v)}>
          <Form.Item name="defaultLocale" label="기본 언어"><Input /></Form.Item>
          <Form.Item name="international" label="국제화 모드" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="lastOrderNumber" label="마지막 수주번호"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={mutation.isPending}>저장</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
