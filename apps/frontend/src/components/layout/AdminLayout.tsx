import { useState, useEffect } from 'react';
import { Box, Drawer } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useSidebarStore } from '@/stores/sidebarStore';

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 64;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

export default function AdminLayout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile ? (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}>
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </Drawer>
      ) : (
        <Box sx={{ width: sidebarWidth, flexShrink: 0, bgcolor: '#fff', borderRight: '1px solid #e0e0e0', transition: 'width 0.2s' }}>
          <Sidebar collapsed={collapsed} />
        </Box>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNavbar isMobile={isMobile} onMenuClick={() => setDrawerOpen(true)} />
        <Box
          component="main"
          sx={{
            flex: 1, p: isMobile ? 1.5 : 3,
            bgcolor: '#f5f5f5', overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
