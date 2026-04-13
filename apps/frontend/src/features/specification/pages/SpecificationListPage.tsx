import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Specification, PaginationParams } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useSpecifications, useDeleteSpecification } from '../hooks/useSpecifications';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function SpecificationListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useSpecifications(filters);
  const deleteMut = useDeleteSpecification();

  const columns: ColumnsType<Specification> = [
    { title: '사양명', dataIndex: 'name', sorter: true },
    { title: '우선순위', dataIndex: 'priority', width: 90 },
    {
      title: '', key: 'actions', width: 120, fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<UnorderedListOutlined />} onClick={() => navigate(`/specifications/${r.id}/details`)} title="상세" />
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
        <Title level={4} style={{ margin: 0 }}>사양관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/specifications/create')}>사양 등록</Button>
      </Row>
      <DataTable<Specification> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit, sort, order }) => setFilters({ page, limit, sort, order })} />
    </>
  );
}
