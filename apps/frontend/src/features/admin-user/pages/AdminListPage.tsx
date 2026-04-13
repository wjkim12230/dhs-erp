import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Admin, PaginationParams } from '@dhs/shared';
import { Role, enumToOptions, ROLE_LABELS } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { adminApi } from '../api/adminApi';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function AdminListPage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useQuery({ queryKey: ['admins', filters], queryFn: () => adminApi.getList(filters) });

  const createMut = useMutation({ mutationFn: adminApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); message.success('관리자가 등록되었습니다.'); } });
  const deleteMut = useMutation({ mutationFn: adminApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admins'] }); message.success('삭제되었습니다.'); } });
  const resetMut = useMutation({ mutationFn: ({ id, pw }: { id: number; pw: string }) => adminApi.resetPassword(id, pw),
    onSuccess: () => message.success('비밀번호가 초기화되었습니다.') });

  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<number | null>(null);
  const [createForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  const columns: ColumnsType<Admin> = [
    { title: '아이디', dataIndex: 'loginId' },
    { title: '이름', dataIndex: 'name' },
    { title: '권한', dataIndex: 'role', render: (v: string) => <Tag>{ROLE_LABELS[v as keyof typeof ROLE_LABELS]}</Tag> },
    { title: '활성', dataIndex: 'isEnabled', width: 60, render: (v: boolean) => v ? <Tag color="green">활성</Tag> : <Tag>비활성</Tag> },
    {
      title: '', key: 'actions', width: 100,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<KeyOutlined />} onClick={() => { resetForm.resetFields(); setResetTarget(r.id); }} title="비밀번호 초기화" />
          <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>관리자</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { createForm.resetFields(); setCreateOpen(true); }}>관리자 추가</Button>
      </Row>
      <DataTable<Admin> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit }) => setFilters({ page, limit })} />

      <Modal title="관리자 추가" open={createOpen} onOk={() => createForm.validateFields().then((v) => createMut.mutate(v, { onSuccess: () => setCreateOpen(false) }))}
        onCancel={() => setCreateOpen(false)} confirmLoading={createMut.isPending} okText="저장" cancelText="취소">
        <Form form={createForm} layout="vertical">
          <Form.Item name="loginId" label="아이디" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="이름" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="password" label="비밀번호" rules={[{ required: true, min: 4 }]}><Input.Password /></Form.Item>
          <Form.Item name="role" label="권한" rules={[{ required: true }]}>
            <Select options={enumToOptions(Role, ROLE_LABELS)} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="비밀번호 초기화" open={resetTarget !== null}
        onOk={() => resetForm.validateFields().then((v) => resetMut.mutate({ id: resetTarget!, pw: v.password }, { onSuccess: () => setResetTarget(null) }))}
        onCancel={() => setResetTarget(null)} confirmLoading={resetMut.isPending} okText="초기화" cancelText="취소">
        <Form form={resetForm} layout="vertical">
          <Form.Item name="password" label="새 비밀번호" rules={[{ required: true, min: 4 }]}><Input.Password /></Form.Item>
        </Form>
      </Modal>
    </>
  );
}
