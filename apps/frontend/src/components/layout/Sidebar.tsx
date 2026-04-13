import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const hasRole = useAuthStore((s) => s.hasRole);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: '직원관리',
    },
    {
      key: 'product',
      icon: <AppstoreOutlined />,
      label: '제품관리',
      children: [
        { key: '/model-groups', label: '모델그룹' },
        { key: '/models', label: '모델' },
        { key: '/specifications', label: '사양' },
        { key: '/drawings', label: '도면' },
        { key: '/check-items', label: '검사항목' },
      ],
    },
    {
      key: '/orderings',
      icon: <FileTextOutlined />,
      label: '수주관리',
    },
    ...(hasRole('SUPER')
      ? [
          {
            key: 'system',
            icon: <SettingOutlined />,
            label: '시스템',
            children: [
              { key: '/admins', icon: <UserOutlined />, label: '관리자' },
              { key: '/settings', icon: <SettingOutlined />, label: '설정' },
            ],
          } as MenuItem,
        ]
      : []),
  ];

  const selectedKey = '/' + location.pathname.split('/').filter(Boolean)[0];

  const openKeys = menuItems
    .filter((item: any) => item?.children?.some((child: any) => child.key === selectedKey))
    .map((item: any) => item?.key as string);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ minHeight: '100vh', background: '#fff', borderRight: '1px solid #f0f0f0' }}
      theme="light"
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: collapsed ? '12px 8px' : '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <img
          src="/logo.png"
          alt="DHS"
          style={{ height: 32, objectFit: 'contain' }}
        />
        {!collapsed && (
          <span style={{ color: '#005BAC', fontSize: 14, fontWeight: 700, marginLeft: 8 }}>ERP</span>
        )}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={({ key }) => { navigate(key); onNavigate?.(); }}
      />
    </Sider>
  );
}
