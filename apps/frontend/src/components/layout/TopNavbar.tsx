import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from '@heroui/react';
import { Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '@dhs/shared';

interface Props { isMobile?: boolean; collapsed?: boolean; onMenuClick?: () => void; }

export default function TopNavbar({ isMobile, onMenuClick }: Props) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
      <div>
        <Button isIconOnly variant="light" size="sm" onPress={onMenuClick}><Menu size={20} /></Button>
      </div>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar name={user?.name?.[0]} size="sm" className="bg-brand text-white" />
            {!isMobile && <span className="text-sm font-medium">{user?.name}</span>}
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu">
          <DropdownItem key="info" className="opacity-100" isReadOnly>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role ? ROLE_LABELS[user.role] : ''}</p>
          </DropdownItem>
          <DropdownItem key="logout" startContent={<LogOut size={14} />} onPress={() => { logout(); navigate('/login'); }}>
            로그아웃
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
}
