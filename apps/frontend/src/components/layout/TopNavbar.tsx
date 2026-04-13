import { Layout, Dropdown, Space, Avatar, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '@dhs/shared';

const { Header } = Layout;
const { Text } = Typography;

export default function TopNavbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Dropdown
        menu={{
          items: [
            {
              key: 'info',
              label: (
                <Space direction="vertical" size={0}>
                  <Text strong>{user?.name}</Text>
                  <Text type="secondary">{user?.role ? ROLE_LABELS[user.role] : ''}</Text>
                </Space>
              ),
              disabled: true,
            },
            { type: 'divider' },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '로그아웃',
              onClick: handleLogout,
            },
          ],
        }}
        placement="bottomRight"
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <Text>{user?.name}</Text>
        </Space>
      </Dropdown>
    </Header>
  );
}
