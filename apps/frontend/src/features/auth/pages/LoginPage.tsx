import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginId, password);
      enqueueSnackbar('로그인 성공', { variant: 'success' });
      navigate('/dashboard');
    } catch {
      enqueueSnackbar('아이디 또는 비밀번호가 올바르지 않습니다.', { variant: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Card sx={{ width: '100%', maxWidth: 400, mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img src="/logo.png" alt="DHS" style={{ height: 48, marginBottom: 12 }} />
            <Typography variant="body2" color="text.secondary">관리자 로그인</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField label="아이디" value={loginId} onChange={(e) => setLoginId(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
