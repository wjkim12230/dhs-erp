import { useState } from 'react';
import { Button, Input, Select, Space, Row, Col, Typography, Tabs, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { OrderingFilter, OrderStatus } from '@dhs/shared';
import { ORDER_STATUS_LABELS } from '@dhs/shared';
import { useOrderings, useDeleteOrdering, useCompleteOrdering, useRecoverOrdering } from '../hooks/useOrderings';
import OrderingTable from '../components/OrderingTable';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function OrderingListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<OrderStatus>('ACTIVE');
  const [filters, setFilters] = useState<OrderingFilter>({ page: 1, limit: 20, status: 'ACTIVE' });
  const [searchName, setSearchName] = useState('');

  const { data, isLoading } = useOrderings(filters);
  const deleteMut = useDeleteOrdering();
  const completeMut = useCompleteOrdering();
  const recoverMut = useRecoverOrdering();

  const handleTabChange = (key: string) => {
    const status = key as OrderStatus;
    setActiveTab(status);
    setFilters((p) => ({ ...p, status, page: 1 }));
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>수주관리</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/orderings/create')}>수주 등록</Button>
      </Row>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={[
        { key: 'ACTIVE', label: ORDER_STATUS_LABELS.ACTIVE },
        { key: 'COMPLETED', label: ORDER_STATUS_LABELS.COMPLETED },
        { key: 'DELETED', label: ORDER_STATUS_LABELS.DELETED },
      ]} />

      <Space style={{ marginBottom: 16 }} wrap>
        <Input placeholder="고객명" value={searchName} onChange={(e) => setSearchName(e.target.value)}
          onPressEnter={() => setFilters((p) => ({ ...p, customerName: searchName, page: 1 }))}
          suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setFilters((p) => ({ ...p, customerName: searchName, page: 1 }))} />}
          style={{ width: 180 }} />
        <Input placeholder="수주번호" style={{ width: 160 }}
          onPressEnter={(e) => setFilters((p) => ({ ...p, orderNumber: (e.target as HTMLInputElement).value, page: 1 }))} />
        <RangePicker placeholder={['수주일 시작', '수주일 종료']}
          onChange={(_, ds) => setFilters((p) => ({ ...p, orderDateFrom: ds[0] || undefined, orderDateTo: ds[1] || undefined, page: 1 }))} />
      </Space>

      <OrderingTable
        data={data?.data ?? []} total={data?.meta?.total ?? 0}
        page={filters.page ?? 1} limit={filters.limit ?? 20}
        loading={isLoading} activeTab={activeTab}
        onTableChange={({ page, limit, sort, order }) => setFilters((p) => ({ ...p, page, limit, sort, order }))}
        onDelete={(id) => deleteMut.mutate(id)}
        onComplete={(id) => completeMut.mutate(id)}
        onRecover={(id) => recoverMut.mutate(id)}
      />
    </>
  );
}
