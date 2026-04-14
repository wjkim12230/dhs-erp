import { useState } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await login(loginId, password); toast.success('로그인 성공'); navigate('/dashboard'); }
    catch { toast.error('아이디 또는 비밀번호가 올바르지 않습니다.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="DHS" className="h-12 mx-auto mb-3" />
            <p className="text-sm text-gray-500">관리자 로그인</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="아이디" value={loginId} onValueChange={setLoginId} isRequired size="lg" />
            <Input label="비밀번호" type="password" value={password} onValueChange={setPassword} isRequired size="lg" />
            <Button type="submit" color="primary" className="w-full" size="lg" isLoading={loading}>로그인</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
