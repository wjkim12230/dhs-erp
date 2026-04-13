import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Avatar, Box, Divider } from '@mui/material';
import { Menu as MenuIcon, Logout, Person } from '@mui/icons-material';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS } from '@dhs/shared';

interface TopNavbarProps {
  isMobile?: boolean;
  onMenuClick?: () => void;
}

export default function TopNavbar({ isMobile, onMenuClick }: TopNavbarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {user?.name?.[0] || <Person />}
          </Avatar>
          {!isMobile && (
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>{user?.name}</Typography>
          )}
        </Box>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role ? ROLE_LABELS[user.role] : ''}</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> 로그아웃
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
