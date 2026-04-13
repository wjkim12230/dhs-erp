import { Layout, Dropdown, Space, Avatar, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '@dhs/shared';

const { Header } = Layout;
const { Text } = Typography;

interface TopNavbarProps {
  isMobile?: boolean;
  onMenuClick?: () => void;
}

export default function TopNavbar({ isMobile, onMenuClick }: TopNavbarProps) {
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
        padding: isMobile ? '0 12px' : '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
    >
      <div>
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} style={{ fontSize: 18 }} />
        )}
      </div>
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
          {!isMobile && <Text>{user?.name}</Text>}
        </Space>
      </Dropdown>
    </Header>
  );
}
