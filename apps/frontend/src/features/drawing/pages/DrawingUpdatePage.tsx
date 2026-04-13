import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Form, InputNumber, Button, Space, Row, Col } from 'antd';
import { useDrawing, useUpdateDrawing } from '../hooks/useDrawings';
import ImageUpload from '@/components/common/ImageUpload';

export default function DrawingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDrawing(Number(id));
  const mutation = useUpdateDrawing();
  const [form] = Form.useForm();
  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  const drawing = data?.data;
  if (!drawing) return null;

  return (
    <Card title="도면 수정">
      <Form form={form} layout="vertical" initialValues={drawing} style={{ maxWidth: 600 }}
        onFinish={(v) => mutation.mutate({ id: drawing.id, data: { ...v, version: drawing.version } }, { onSuccess: () => navigate('/drawings') })}>
        <Form.Item name="imageUrl" label="도면 이미지" rules={[{ required: true, message: '이미지를 업로드해주세요' }]}>
          <ImageUpload />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="lengthCount" label="길이수"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Form.Item><Space><Button type="primary" htmlType="submit" loading={mutation.isPending}>수정</Button><Button onClick={() => navigate('/drawings')}>취소</Button></Space></Form.Item>
      </Form>
    </Card>
  );
}
