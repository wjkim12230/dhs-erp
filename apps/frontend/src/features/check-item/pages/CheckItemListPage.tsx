import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import type { CheckItem, PaginationParams, Model } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useCheckItems, useCreateCheckItem, useDeleteCheckItem } from '../hooks/useCheckItems';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function CheckItemListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useCheckItems(filters);
  const createMut = useCreateCheckItem();
  const deleteMut = useDeleteCheckItem();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data: models } = useQuery({
    queryKey: ['models', 'select'],
    queryFn: async () => { const res = await apiClient.get('/models?limit=200'); return res.data.data as Model[]; },
  });

  const columns: ColumnsType<CheckItem> = [
    { title: '검사항목명', dataIndex: 'name', sorter: true },
    { title: '우선순위', dataIndex: 'priority', width: 90 },
    {
      title: '', key: 'actions', width: 100,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<UnorderedListOutlined />} onClick={() => navigate(`/check-items/${r.id}/details`)} />
          <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>검사항목</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }}>추가</Button>
      </Row>
      <DataTable<CheckItem> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit }) => setFilters({ page, limit })} />
      <Modal title="검사항목 추가" open={open} onOk={() => form.validateFields().then((v) => createMut.mutate(v, { onSuccess: () => { setOpen(false); } }))}
        onCancel={() => setOpen(false)} confirmLoading={createMut.isPending} okText="저장" cancelText="취소">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="항목명" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="modelId" label="모델" rules={[{ required: true }]}>
            <Select options={models?.map((m) => ({ label: m.name, value: m.id }))} placeholder="모델 선택" />
          </Form.Item>
          <Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
