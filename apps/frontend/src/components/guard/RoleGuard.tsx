import { ReactNode } from 'react';
import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@dhs/shared';

export default function RoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const navigate = useNavigate();
  if (!hasRole(...roles)) {
    return (
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-danger mb-2">403</h1>
        <h2 className="text-xl font-semibold mb-2">접근 권한 없음</h2>
        <p className="text-gray-500 mb-6">이 페이지에 접근할 권한이 없습니다.</p>
        <Button color="primary" onPress={() => navigate(-1)}>돌아가기</Button>
      </div>
    );
  }
  return <>{children}</>;
}
