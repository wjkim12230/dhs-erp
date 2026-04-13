import { useState } from 'react';
import { Button, Input, Select, Space, Row, Col, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  Department,
  EmploymentStatus,
  Headquarter,
  enumToOptions,
  DEPARTMENT_LABELS,
  EMPLOYMENT_STATUS_LABELS,
  HEADQUARTER_LABELS,
} from '@dhs/shared';
import type { EmployeeFilter } from '@dhs/shared';
import { useEmployees, useDeleteEmployee } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import { useAuthStore } from '@/stores/authStore';

const { Title } = Typography;

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const [filters, setFilters] = useState<EmployeeFilter>({ page: 1, limit: 20 });
  const [searchName, setSearchName] = useState('');

  const { data, isLoading } = useEmployees(filters);
  const deleteMutation = useDeleteEmployee();

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, name: searchName, page: 1 }));
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          직원관리
        </Title>
        {hasRole('SUPER', 'ADMIN') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/employees/create')}>
            직원 등록
          </Button>
        )}
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="이름 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 180 }}
          suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
        />
        <Select
          placeholder="부서"
          allowClear
          style={{ width: 140 }}
          options={enumToOptions(Department, DEPARTMENT_LABELS)}
          onChange={(v) => setFilters((prev) => ({ ...prev, department: v, page: 1 }))}
        />
        <Select
          placeholder="본부"
          allowClear
          style={{ width: 140 }}
          options={enumToOptions(Headquarter, HEADQUARTER_LABELS)}
          onChange={(v) => setFilters((prev) => ({ ...prev, headquarter: v, page: 1 }))}
        />
        <Select
          placeholder="재직상태"
          allowClear
          style={{ width: 120 }}
          options={enumToOptions(EmploymentStatus, EMPLOYMENT_STATUS_LABELS)}
          onChange={(v) => setFilters((prev) => ({ ...prev, employmentStatus: v, page: 1 }))}
        />
      </Space>

      <EmployeeTable
        data={data?.data ?? []}
        total={data?.meta?.total ?? 0}
        page={filters.page ?? 1}
        limit={filters.limit ?? 20}
        loading={isLoading}
        onTableChange={({ page, limit, sort, order }) =>
          setFilters((prev) => ({ ...prev, page, limit, sort, order }))
        }
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </>
  );
}
