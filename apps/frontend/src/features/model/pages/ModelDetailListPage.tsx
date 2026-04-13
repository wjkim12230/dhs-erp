import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Typography, Space, Popconfirm, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ModelDetail } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useModelDetails, useCreateModelDetail, useDeleteModelDetail } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function ModelDetailListPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const mid = Number(modelId);
  const { data, isLoading } = useModelDetails(mid);
  const createMut = useCreateModelDetail(mid);
  const deleteMut = useDeleteModelDetail(mid);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((v) => createMut.mutate(v, { onSuccess: () => { setOpen(false); form.resetFields(); } }));
  };

  const columns: ColumnsType<ModelDetail> = [
    { title: '상세항목명', dataIndex: 'name' },
    { title: '우선순위', dataIndex: 'priority', width: 100 },
    {
      title: '', key: 'actions', width: 60,
      render: (_, r) => (
        <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)} okText="삭제" cancelText="취소">
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>모델 상세항목</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>추가</Button>
      </Row>
      <DataTable<ModelDetail> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.data?.length ?? 0} page={1} limit={100} />
      <Modal title="상세항목 추가" open={open} onOk={handleOk} onCancel={() => setOpen(false)}
        confirmLoading={createMut.isPending} okText="저장" cancelText="취소">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="항목명" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
