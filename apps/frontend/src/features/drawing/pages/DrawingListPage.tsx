import { useState } from 'react';
import { Button, Row, Typography, Space, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Drawing, PaginationParams } from '@dhs/shared';
import type { ColumnsType } from 'antd/es/table';
import { useDrawings, useDeleteDrawing } from '../hooks/useDrawings';
import DataTable from '@/components/common/DataTable';

const { Title } = Typography;

export default function DrawingListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<PaginationParams>({ page: 1, limit: 20 });
  const { data, isLoading } = useDrawings(filters);
  const deleteMut = useDeleteDrawing();

  const columns: ColumnsType<Drawing> = [
    { title: '도면', dataIndex: 'imageUrl', width: 80, render: (v: string) => v ? <Image src={v} width={50} height={50} style={{ objectFit: 'cover' }} /> : '-' },
    { title: '길이수', dataIndex: 'lengthCount', width: 80 },
    {
      title: '', key: 'actions', width: 100, fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/drawings/${r.id}/edit`)} />
          <Popconfirm title="삭제?" onConfirm={() => deleteMut.mutate(r.id)}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>도면관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/drawings/create')}>도면 등록</Button>
      </Row>
      <DataTable<Drawing> rowKey="id" columns={columns} dataSource={data?.data ?? []} loading={isLoading}
        total={data?.meta?.total ?? 0} page={filters.page ?? 1} limit={filters.limit ?? 20}
        onTableChange={({ page, limit }) => setFilters({ page, limit })} />
    </>
  );
}
