import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Model, PaginationParams } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useModels, useDeleteModel } from '../hooks/useModels';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function ModelListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useModels(filters);
  const deleteMut = useDeleteModel();

  const columns: ColumnsType<Model> = [
    { title: '모델명', dataIndex: 'name', sorter: true },
    { title: '수주명', dataIndex: 'orderingName' },
    { title: '모델그룹', render: (_, r) => r.modelGroup?.name ?? '-' },
    { title: '우선순위', dataIndex: 'priority', width: 90 },
    {
      title: '', key: 'actions', width: 120, fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<UnorderedListOutlined />} onClick={() => navigate(`/models/${r.id}/details`)} title="상세항목" />
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/models/${r.id}/edit`)} />
          <Popconfirm title="삭제하시겠습니까?" onConfirm={() => deleteMut.mutate(r.id)} okText="삭제" cancelText="취소">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>모델관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/models/create')}>모델 등록</Button>
      </Row>
      <DataTable<Model> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit, sort, order }) => setFilters({ page, limit, sort, order })} />
    </>
  );
}
