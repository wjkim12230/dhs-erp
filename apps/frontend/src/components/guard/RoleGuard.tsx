import { ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@dhs/shared';

export default function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const navigate = useNavigate();

  if (!hasRole(...roles)) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h3" color="error" gutterBottom>403</Typography>
        <Typography variant="h6" gutterBottom>접근 권한 없음</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>이 페이지에 접근할 권한이 없습니다.</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>돌아가기</Button>
      </Box>
    );
  }

  return <>{children}</>;
}
