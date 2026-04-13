import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Select, Button, Space, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import { useCreateSpecification } from '../hooks/useSpecifications';
import type { Model, SpecificationCreateDto } from '@dhs/shared';

export default function SpecificationCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateSpecification();
  const [form] = Form.useForm();

  const { data: models } = useQuery({
    queryKey: ['models', 'select'],
    queryFn: async () => { const res = await apiClient.get('/models?limit=200'); return res.data.data as Model[]; },
  });

  return (
    <Card title="사양 등록">
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}
        onFinish={(v: SpecificationCreateDto) => mutation.mutate(v, { onSuccess: () => navigate('/specifications') })}>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="name" label="사양명" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Form.Item name="modelId" label="모델" rules={[{ required: true }]}>
          <Select options={models?.map((m) => ({ label: m.name, value: m.id }))} placeholder="모델 선택" />
        </Form.Item>
        <Form.Item><Space><Button type="primary" htmlType="submit" loading={mutation.isPending}>등록</Button><Button onClick={() => navigate('/specifications')}>취소</Button></Space></Form.Item>
      </Form>
    </Card>
  );
}
