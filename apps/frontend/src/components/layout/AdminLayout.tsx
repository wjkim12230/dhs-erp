import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useSidebarStore } from '@/stores/sidebarStore';

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const h = () => setM(window.innerWidth < 768); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  return m;
}

export default function AdminLayout() {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  useEffect(() => { if (isMobile) setCollapsed(true); }, [isMobile]);

  return (
    <div className="flex min-h-screen">
      {isMobile && drawerOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setDrawerOpen(false)} />}
      <aside className={`
        ${isMobile ? 'fixed z-50 h-full transition-transform' : 'relative shrink-0'}
        ${isMobile && !drawerOpen ? '-translate-x-full' : 'translate-x-0'}
        ${collapsed && !isMobile ? 'w-16' : 'w-60'}
        bg-white border-r border-gray-200 transition-all duration-200
      `}>
        <Sidebar collapsed={collapsed && !isMobile} onNavigate={() => isMobile && setDrawerOpen(false)} />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar isMobile={isMobile} collapsed={collapsed} onMenuClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)} />
        <main className={`flex-1 ${isMobile ? 'p-3' : 'p-6'} bg-gray-50 overflow-auto`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
