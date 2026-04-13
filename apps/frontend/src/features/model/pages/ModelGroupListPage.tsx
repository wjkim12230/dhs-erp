import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ModelGroup, PaginationParams } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useModelGroups, useCreateModelGroup, useUpdateModelGroup, useDeleteModelGroup } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function ModelGroupListPage() {
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModelGroups(filters);
  const createMut = useCreateModelGroup();
  const updateMut = useUpdateModelGroup();
  const deleteMut = useDeleteModelGroup();
  const [modal, setModal] = useState<{ open: boolean; editing?: ModelGroup }>({ open: false });
  const [form] = Form.useForm();

  const openCreate = () => { form.resetFields(); setModal({ open: true }); };
  const openEdit = (g: ModelGroup) => { form.setFieldsValue(g); setModal({ open: true, editing: g }); };
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (modal.editing) {
        updateMut.mutate({ id: modal.editing.id, data: { ...values, version: modal.editing.version } }, { onSuccess: () => setModal({ open: false }) });
      } else {
        createMut.mutate(values, { onSuccess: () => setModal({ open: false }) });
      }
    });
  };

  const columns: ColumnsType<ModelGroup> = [
    { title: '그룹명', dataIndex: 'name', sorter: true },
    { title: '우선순위', dataIndex: 'priority', width: 100 },
    { title: '모델 수', render: (_, r) => r.models?.length ?? 0, width: 100 },
    {
      title: '', key: 'actions', width: 100,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)} okText="삭제" cancelText="취소">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>모델그룹</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>그룹 추가</Button>
      </Row>
      <DataTable<ModelGroup> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit }) => setFilters({ page, limit })} />
      <Modal title={modal.editing ? '그룹 수정' : '그룹 추가'} open={modal.open} onOk={handleOk} onCancel={() => setModal({ open: false })}
        confirmLoading={createMut.isPending || updateMut.isPending} okText="저장" cancelText="취소">
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="그룹명" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="priority" label="우선순위"><InputNumber style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
