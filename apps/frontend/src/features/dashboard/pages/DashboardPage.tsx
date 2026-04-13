import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  FormOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

const { Title } = Typography;

export default function DashboardPage() {
  const { data: employeeData } = useQuery({
    queryKey: ['dashboard', 'employees'],
    queryFn: async () => {
      const res = await apiClient.get('/employees?limit=1&employmentStatus=ACTIVE');
      return res.data.meta?.total ?? 0;
    },
  });

  const { data: orderingData } = useQuery({
    queryKey: ['dashboard', 'orderings'],
    queryFn: async () => {
      const res = await apiClient.get('/orderings?limit=1&status=ACTIVE');
      return res.data.meta?.total ?? 0;
    },
  });

  const { data: completedData } = useQuery({
    queryKey: ['dashboard', 'orderings-completed'],
    queryFn: async () => {
      const res = await apiClient.get('/orderings?limit=1&status=COMPLETED');
      return res.data.meta?.total ?? 0;
    },
  });

  const { data: orderFormData } = useQuery({
    queryKey: ['dashboard', 'order-forms'],
    queryFn: async () => {
      const res = await apiClient.get('/order-forms?limit=1&status=ACTIVE');
      return res.data.meta?.total ?? 0;
    },
  });

  return (
    <>
      <Title level={4} style={{ marginBottom: 24 }}>
        대시보드
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="재직 직원"
              value={employeeData ?? '-'}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="진행중 수주"
              value={orderingData ?? '-'}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="완료 수주"
              value={completedData ?? '-'}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="진행중 발주서"
              value={orderFormData ?? '-'}
              prefix={<FormOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
