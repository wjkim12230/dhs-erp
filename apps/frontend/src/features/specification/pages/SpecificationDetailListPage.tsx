import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Typography, Popconfirm, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { SpecificationDetail } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useSpecificationDetails, useCreateSpecDetail, useDeleteSpecDetail } from '../hooks/useSpecifications';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function SpecificationDetailListPage() {
  const { specId } = useParams<{ specId: string }>();
  const sid = Number(specId);
  const { data, isLoading } = useSpecificationDetails(sid);
  const createMut = useCreateSpecDetail(sid);
  const deleteMut = useDeleteSpecDetail(sid);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: ColumnsType<SpecificationDetail> = [
    { title: '상세명', dataIndex: 'name' },
    { title: '수주값', dataIndex: 'orderingValue' },
    { title: '우선순위', dataIndex: 'priority', width: 90 },
    { title: '', key: 'a', width: 60, render: (_, r) => (
      <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
    )},
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>사양 상세</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>추가</Button>
      </Row>
      <DataTable<SpecificationDetail> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading} total={data?.data?.length ?? 0} page={1} limit={100} />
      <Modal title="상세 추가" open={open} onOk={() => form.validateFields().then((v) => createMut.mutate(v, { onSuccess: () => { setOpen(false); form.resetFields(); } }))}
        onCancel={() => setOpen(false)} confirmLoading={createMut.isPending} okText="저장" cancelText="취소">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="상세명" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="orderingValue" label="수주값"><Input /></Form.Item>
          <Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
