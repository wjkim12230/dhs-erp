import { ReactNode } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@dhs/shared';

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const navigate = useNavigate();

  if (!hasRole(...roles)) {
    return (
      <Result
        status="403"
        title="접근 권한 없음"
        subTitle="이 페이지에 접근할 권한이 없습니다."
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
