import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Form, Input, DatePicker, Row, Col, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { useOrdering, useCreateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';

export default function OrderingCopyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useOrdering(Number(id));
  const mutation = useCreateOrdering();
  const [form] = Form.useForm();

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  const ordering = data?.data;
  if (!ordering) return null;

  const initial = {
    ...ordering,
    orderNumber: '', // 새 수주번호 필요
    orderDate: ordering.orderDate ? dayjs(ordering.orderDate) : undefined,
    dueDate: ordering.dueDate ? dayjs(ordering.dueDate) : undefined,
    expectedDeliveryDate: ordering.expectedDeliveryDate ? dayjs(ordering.expectedDeliveryDate) : undefined,
  };

  const handleFinish = (values: any) => {
    mutation.mutate({
      ...values,
      modelId: ordering.modelId,
      orderDate: values.orderDate?.format('YYYY-MM-DD'),
      dueDate: values.dueDate?.format('YYYY-MM-DD'),
      expectedDeliveryDate: values.expectedDeliveryDate?.format('YYYY-MM-DD'),
    }, { onSuccess: () => navigate('/orderings') });
  };

  return (
    <Card title="수주 복사">
      <Form form={form} layout="vertical" initialValues={initial} onFinish={handleFinish} style={{ maxWidth: 800 }}>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="customerName" label="고객명" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="orderNumber" label="수주번호" rules={[{ required: true }]}><Input placeholder="새 수주번호 입력" /></Form.Item></Col>
          <Col span={8}><Form.Item name="siteName" label="현장명"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="orderer" label="발주자"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="customerContact" label="연락처"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="quantity" label="수량"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="orderDate" label="수주일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="dueDate" label="납기일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={8}><Form.Item name="expectedDeliveryDate" label="출하예정일"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Form.Item name="memo" label="메모"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={mutation.isPending}>복사 등록</Button>
            <Button onClick={() => navigate('/orderings')}>취소</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
