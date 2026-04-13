import { Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CopyOutlined, UndoOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Ordering, OrderStatus } from '@dhs/shared';
import { formatDate } from '@dhs/shared';
import DataTable from '@/components/common/DataTable';
import StatusTag from '@/components/common/StatusTag';

interface Props {
  data: Ordering[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  activeTab: OrderStatus;
  onTableChange: (p: { page: number; limit: number; sort?: string; order?: 'asc' | 'desc' }) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
  onRecover: (id: number) => void;
}

export default function OrderingTable({ data, total, page, limit, loading, activeTab, onTableChange, onDelete, onComplete, onRecover }: Props) {
  const navigate = useNavigate();

  const columns: ColumnsType<Ordering> = [
    { title: '수주번호', dataIndex: 'orderNumber', width: 120, sorter: true },
    { title: '고객명', dataIndex: 'customerName', width: 120 },
    { title: '모델', width: 100, render: (_, r) => r.model?.name ?? '-' },
    { title: '수주일', dataIndex: 'orderDate', width: 110, render: (v: string) => formatDate(v), sorter: true },
    { title: '납기일', dataIndex: 'dueDate', width: 110, render: (v: string) => formatDate(v) },
    { title: '수량', dataIndex: 'quantity', width: 80 },
    { title: '상태', dataIndex: 'status', width: 80, render: (v: OrderStatus) => <StatusTag status={v} /> },
    {
      title: '',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {activeTab === 'ACTIVE' && (
            <>
              <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/orderings/${record.id}/edit`)} />
              <Popconfirm title="완료 처리하시겠습니까?" onConfirm={() => onComplete(record.id)} okText="확인" cancelText="취소">
                <Button size="small" icon={<CheckOutlined />} />
              </Popconfirm>
              <Button size="small" icon={<CopyOutlined />} onClick={() => navigate(`/orderings/${record.id}/copy`)} />
              <Popconfirm title="삭제하시겠습니까?" onConfirm={() => onDelete(record.id)} okText="삭제" cancelText="취소">
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
          {activeTab === 'COMPLETED' && (
            <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/orderings/${record.id}/edit`)} />
          )}
          {activeTab === 'DELETED' && (
            <Popconfirm title="복구하시겠습니까?" onConfirm={() => onRecover(record.id)} okText="복구" cancelText="취소">
              <Button size="small" icon={<UndoOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return <DataTable<Ordering> rowKey="id" columns={columns} dataSource={data} loading={loading} total={total} page={page} limit={limit} onTableChange={onTableChange} />;
}
