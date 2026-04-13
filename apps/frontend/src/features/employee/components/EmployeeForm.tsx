import { Form, Input, Select, DatePicker, InputNumber, Row, Col, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Employee, EmployeeCreateDto } from '@dhs/shared';
import DaumAddressSearch from '@/components/common/DaumAddressSearch';
import StickyActions from '@/components/common/StickyActions';
import {
  Position,
  JobGroup,
  Headquarter,
  Department,
  Gender,
  EmploymentStatus,
  enumToOptions,
  POSITION_LABELS,
  JOB_GROUP_LABELS,
  HEADQUARTER_LABELS,
  DEPARTMENT_LABELS,
  GENDER_LABELS,
  EMPLOYMENT_STATUS_LABELS,
} from '@dhs/shared';

interface EmployeeFormProps {
  initialValues?: Employee;
  onSubmit: (values: EmployeeCreateDto) => void;
  loading?: boolean;
}

export default function EmployeeForm({ initialValues, onSubmit, loading }: EmployeeFormProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEdit = !!initialValues;

  const handleFinish = (values: any) => {
    const data: EmployeeCreateDto = {
      ...values,
      birthDate: values.birthDate?.format('YYYY-MM-DD'),
      joinDate: values.joinDate?.format('YYYY-MM-DD'),
    };
    onSubmit(data);
  };

  const initial = initialValues
    ? {
        ...initialValues,
        birthDate: initialValues.birthDate ? dayjs(initialValues.birthDate) : undefined,
        joinDate: initialValues.joinDate ? dayjs(initialValues.joinDate) : undefined,
      }
    : undefined;

  return (
    <Card title={isEdit ? '직원 수정' : '직원 등록'}>
      <StickyActions>
        <Button type="primary" loading={loading} onClick={() => form.submit()}>
          {isEdit ? '수정' : '등록'}
        </Button>
        <Button onClick={() => navigate('/employees')}>취소</Button>
      </StickyActions>
      <Form
        form={form}
        layout="vertical"
        initialValues={initial}
        onFinish={handleFinish}
        style={{ maxWidth: 900 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="name" label="이름" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="employeeNumber" label="사번" rules={[{ required: true }]}>
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="gender" label="성별" rules={[{ required: true }]}>
              <Select options={enumToOptions(Gender, GENDER_LABELS)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="position" label="직급" rules={[{ required: true }]}>
              <Select options={enumToOptions(Position, POSITION_LABELS)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="jobGroup" label="직군" rules={[{ required: true }]}>
              <Select options={enumToOptions(JobGroup, JOB_GROUP_LABELS)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="headquarter" label="본부" rules={[{ required: true }]}>
              <Select options={enumToOptions(Headquarter, HEADQUARTER_LABELS)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="department" label="부서" rules={[{ required: true }]}>
              <Select options={enumToOptions(Department, DEPARTMENT_LABELS)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="employmentStatus" label="재직상태">
              <Select options={enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="salary" label="급여">
              <InputNumber style={{ width: '100%' }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="contact" label="연락처">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="internalNumber" label="내선번호">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="birthDate" label="생년월일">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="joinDate" label="입사일">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item name="address" label="주소">
              <DaumAddressSearch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="memo" label="메모">
          <Input.TextArea rows={3} />
        </Form.Item>

      </Form>
    </Card>
  );
}
