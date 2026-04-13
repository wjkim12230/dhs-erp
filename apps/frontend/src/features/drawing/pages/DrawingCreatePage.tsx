import { useNavigate } from 'react-router-dom';
import { Card, Form, InputNumber, Select, Button, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import { useCreateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';
import StickyActions from '@/components/common/StickyActions';
import type { Model, DrawingCreateDto } from '@dhs/shared';

export default function DrawingCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateDrawing();
  const [form] = Form.useForm();
  const { data: models } = useQuery({
    queryKey: ['models', 'select'],
    queryFn: async () => { const res = await apiClient.get('/models?limit=200'); return res.data.data as Model[]; },
  });

  return (
    <Card title="도면 등록">
      <StickyActions>
        <Button type="primary" loading={mutation.isPending} onClick={() => form.submit()}>등록</Button>
        <Button onClick={() => navigate('/drawings')}>취소</Button>
      </StickyActions>
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}
        onFinish={(v: DrawingCreateDto) => mutation.mutate(v, { onSuccess: () => navigate('/drawings') })}>
        <Form.Item name="imageUrl" label="도면 이미지" rules={[{ required: true, message: '이미지를 업로드해주세요' }]}>
          <ImageUpload />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="lengthCount" label="길이수"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={12}>
            <Form.Item name="modelId" label="모델" rules={[{ required: true }]}>
              <Select options={models?.map((m) => ({ label: m.name, value: m.id }))} placeholder="모델 선택" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
