import { Form, Input, InputNumber, Select, Button, Space, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Model, ModelCreateDto } from '@dhs/shared';
import { Department, enumToOptions, DEPARTMENT_LABELS } from '@dhs/shared';
import { useModelGroups } from '../hooks/useModels';

interface Props { initialValues?: Model; onSubmit: (v: ModelCreateDto) => void; loading?: boolean; }

export default function ModelForm({ initialValues, onSubmit, loading }: Props) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: groupsData } = useModelGroups({ limit: 100 });
  const isEdit = !!initialValues;

  return (
    <Card title={isEdit ? '모델 수정' : '모델 등록'}>
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={onSubmit} style={{ maxWidth: 700 }}>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="name" label="모델명" rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="orderingName" label="수주명"><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="modelGroupId" label="모델그룹" rules={[{ required: true }]}>
              <Select options={groupsData?.data?.map((g) => ({ label: g.name, value: g.id }))} placeholder="그룹 선택" />
            </Form.Item>
          </Col>
          <Col span={12}><Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Form.Item name="departments" label="부서">
          <Select mode="multiple" options={enumToOptions(Department, DEPARTMENT_LABELS)} placeholder="부서 선택" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>{isEdit ? '수정' : '등록'}</Button>
            <Button onClick={() => navigate('/models')}>취소</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
