import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, Users, Package, List, Settings, UserCog, ChevronDown, ChevronRight, Layers, Ruler, PenTool, ClipboardCheck, FileText } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface Props { collapsed?: boolean; onNavigate?: () => void; }
interface NavItem { key: string; label: string; icon: any; children?: { key: string; label: string; icon?: any }[]; }

export default function Sidebar({ collapsed, onNavigate }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRole = useAuthStore((s) => s.hasRole);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ product: true });

  const navItems: NavItem[] = [
    { key: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { key: '/employees', label: '직원관리', icon: Users },
    { key: 'product', label: '제품관리', icon: Package, children: [
      { key: '/model-groups', label: '모델그룹', icon: Layers },
      { key: '/models', label: '모델', icon: List },
      { key: '/specifications', label: '사양', icon: Ruler },
      { key: '/drawings', label: '도면', icon: PenTool },
      { key: '/check-items', label: '검사항목', icon: ClipboardCheck },
    ]},
    { key: '/orderings', label: '수주관리', icon: FileText },
    ...(hasRole('SUPER') ? [{ key: 'system', label: '시스템', icon: Settings, children: [
      { key: '/admins', label: '관리자', icon: UserCog },
      { key: '/settings', label: '설정', icon: Settings },
    ]}] : []),
  ];

  const isActive = (key: string) => location.pathname === key || location.pathname.startsWith(key + '/');
  const go = (key: string) => { navigate(key); onNavigate?.(); };

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 cursor-pointer" onClick={() => go('/dashboard')}>
        <img src="/logo.png" alt="DHS" className="h-9 object-contain" />
        {!collapsed && <span className="ml-2 text-brand font-bold text-sm">ERP</span>}
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(item => (
          <div key={item.key}>
            <button onClick={() => item.children ? setOpenMenus(p => ({...p, [item.key]: !p[item.key]})) : go(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 mx-1 rounded-lg text-sm transition-colors
                ${!item.children && isActive(item.key) ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'}
                ${collapsed ? 'justify-center px-2' : ''}
              `}>
              <item.icon size={18} />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.children && (openMenus[item.key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </button>
            {item.children && openMenus[item.key] && (
              <div className="mt-0.5">
                {item.children.map(child => (
                  <button key={child.key} onClick={() => go(child.key)}
                    className={`w-full flex items-center gap-2.5 py-2 mx-1 rounded-lg text-sm transition-colors
                      ${collapsed ? 'px-2 justify-center' : 'pl-11 pr-4'}
                      ${isActive(child.key) ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-100'}
                    `}>
                    {child.icon && <child.icon size={15} />}
                    {!collapsed && <span>{child.label}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
