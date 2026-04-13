import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Divider,
} from '@mui/material';
import {
  Dashboard, People, Inventory, Description,
  Settings, Person, ExpandLess, ExpandMore,
  ViewList, Category, Engineering, Draw, Checklist,
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: { key: string; label: string; icon?: React.ReactNode }[];
  roles?: string[];
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ product: true });

  const navItems: NavItem[] = [
    { key: '/dashboard', label: '대시보드', icon: <Dashboard /> },
    { key: '/employees', label: '직원관리', icon: <People /> },
    {
      key: 'product', label: '제품관리', icon: <Inventory />,
      children: [
        { key: '/model-groups', label: '모델그룹', icon: <Category /> },
        { key: '/models', label: '모델', icon: <ViewList /> },
        { key: '/specifications', label: '사양', icon: <Engineering /> },
        { key: '/drawings', label: '도면', icon: <Draw /> },
        { key: '/check-items', label: '검사항목', icon: <Checklist /> },
      ],
    },
    { key: '/orderings', label: '수주관리', icon: <Description /> },
    ...(hasRole('SUPER') ? [{
      key: 'system', label: '시스템', icon: <Settings />,
      children: [
        { key: '/admins', label: '관리자', icon: <Person /> },
        { key: '/settings', label: '설정', icon: <Settings /> },
      ],
    }] : []),
  ];

  const handleClick = (item: NavItem) => {
    if (item.children) {
      setOpenMenus((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
    } else {
      navigate(item.key);
      onNavigate?.();
    }
  };

  const isActive = (key: string) => location.pathname === key || location.pathname.startsWith(key + '/');

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          px: 2, borderBottom: '1px solid #e0e0e0', cursor: 'pointer',
        }}
        onClick={() => { navigate('/dashboard'); onNavigate?.(); }}
      >
        <img src="/logo.png" alt="DHS" style={{ height: 36, objectFit: 'contain' }} />
        {!collapsed && (
          <Box component="span" sx={{ color: '#005BAC', fontSize: 15, fontWeight: 700, ml: 1 }}>ERP</Box>
        )}
      </Box>

      <List sx={{ flex: 1, py: 1 }}>
        {navItems.map((item) => (
          <Box key={item.key}>
            <ListItemButton
              onClick={() => handleClick(item)}
              selected={!item.children && isActive(item.key)}
              sx={{
                mx: 1, borderRadius: 2, mb: 0.5,
                '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />}
              {!collapsed && item.children && (openMenus[item.key] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {item.children && (
              <Collapse in={openMenus[item.key]} unmountOnExit>
                <List disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.key}
                      onClick={() => { navigate(child.key); onNavigate?.(); }}
                      selected={isActive(child.key)}
                      sx={{
                        pl: collapsed ? 2 : 5, mx: 1, borderRadius: 2, mb: 0.3,
                        '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } },
                        '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      {child.icon && <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>{child.icon}</ListItemIcon>}
                      {!collapsed && <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: 13 }} />}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
}
