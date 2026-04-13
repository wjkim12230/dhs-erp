import { Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { Employee } from '@dhs/shared';
import {
  POSITION_LABELS,
  DEPARTMENT_LABELS,
  EMPLOYMENT_STATUS_LABELS,
  HEADQUARTER_LABELS,
} from '@dhs/shared';
import DataTable from '@/components/common/DataTable';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@dhs/shared';

interface EmployeeTableProps {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  onTableChange: (params: { page: number; limit: number; sort?: string; order?: 'asc' | 'desc' }) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({
  data,
  total,
  page,
  limit,
  loading,
  onTableChange,
  onDelete,
}: EmployeeTableProps) {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const canEdit = hasRole('SUPER', 'ADMIN');

  const columns: ColumnsType<Employee> = [
    { title: '사번', dataIndex: 'employeeNumber', width: 100, sorter: true },
    { title: '이름', dataIndex: 'name', width: 100, sorter: true },
    {
      title: '직급',
      dataIndex: 'position',
      width: 90,
      render: (v: string) => POSITION_LABELS[v as keyof typeof POSITION_LABELS] ?? v,
    },
    {
      title: '본부',
      dataIndex: 'headquarter',
      width: 120,
      render: (v: string) => HEADQUARTER_LABELS[v as keyof typeof HEADQUARTER_LABELS] ?? v,
    },
    {
      title: '부서',
      dataIndex: 'department',
      width: 110,
      render: (v: string) => DEPARTMENT_LABELS[v as keyof typeof DEPARTMENT_LABELS] ?? v,
    },
    {
      title: '상태',
      dataIndex: 'employmentStatus',
      width: 80,
      render: (v: string) => {
        const label = EMPLOYMENT_STATUS_LABELS[v as keyof typeof EMPLOYMENT_STATUS_LABELS] ?? v;
        const color = v === 'ACTIVE' ? 'green' : v === 'LEAVE' ? 'orange' : 'default';
        return <Tag color={color}>{label}</Tag>;
      },
    },
    { title: '연락처', dataIndex: 'contact', width: 130 },
    {
      title: '입사일',
      dataIndex: 'joinDate',
      width: 110,
      render: (v: string) => formatDate(v),
      sorter: true,
    },
    ...(canEdit
      ? [
          {
            title: '',
            key: 'actions',
            width: 100,
            fixed: 'right' as const,
            render: (_: unknown, record: Employee) => (
              <Space>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/employees/${record.id}/edit`)}
                />
                <Popconfirm
                  title="삭제하시겠습니까?"
                  onConfirm={() => onDelete(record.id)}
                  okText="삭제"
                  cancelText="취소"
                >
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <DataTable<Employee>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      total={total}
      page={page}
      limit={limit}
      onTableChange={onTableChange}
    />
  );
}
