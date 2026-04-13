import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Card, Form, Input, DatePicker, Row, Col, Button } from 'antd';
import dayjs from 'dayjs';
import { useOrdering, useUpdateOrdering } from '../hooks/useOrderings';
import EmployeeSelect from '@/components/common/EmployeeSelect';
import StickyActions from '@/components/common/StickyActions';

export default function OrderingUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useOrdering(Number(id));
  const mutation = useUpdateOrdering();
  const [form] = Form.useForm();

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  const ordering = data?.data;
  if (!ordering) return null;

  const initial = {
    ...ordering,
    orderDate: ordering.orderDate ? dayjs(ordering.orderDate) : undefined,
    dueDate: ordering.dueDate ? dayjs(ordering.dueDate) : undefined,
    expectedDeliveryDate: ordering.expectedDeliveryDate ? dayjs(ordering.expectedDeliveryDate) : undefined,
  };

  const handleFinish = (values: any) => {
    mutation.mutate({
      id: ordering.id,
      data: {
        ...values,
        orderDate: values.orderDate?.format('YYYY-MM-DD'),
        dueDate: values.dueDate?.format('YYYY-MM-DD'),
        expectedDeliveryDate: values.expectedDeliveryDate?.format('YYYY-MM-DD'),
        version: ordering.version,
      },
    }, { onSuccess: () => navigate('/orderings') });
  };

  return (
    <Card title="수주 수정">
      <StickyActions>
        <Button type="primary" loading={mutation.isPending} onClick={() => form.submit()}>수정</Button>
        <Button onClick={() => navigate('/orderings')}>취소</Button>
      </StickyActions>
      <Form form={form} layout="vertical" initialValues={initial} onFinish={handleFinish} style={{ maxWidth: 800 }}>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="customerName" label="고객명" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="orderNumber" label="수주번호"><Input disabled /></Form.Item></Col>
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
        <Row gutter={16}>
          <Col span={6}><Form.Item name="orderEmployeeId" label="수주담당"><EmployeeSelect /></Form.Item></Col>
          <Col span={6}><Form.Item name="receiptEmployeeId" label="접수담당"><EmployeeSelect /></Form.Item></Col>
          <Col span={6}><Form.Item name="packagingEmployeeId" label="포장담당"><EmployeeSelect /></Form.Item></Col>
          <Col span={6}><Form.Item name="shippingEmployeeId" label="출하담당"><EmployeeSelect /></Form.Item></Col>
        </Row>
        <Form.Item name="memo" label="메모"><Input.TextArea rows={2} /></Form.Item>
      </Form>
    </Card>
  );
}
