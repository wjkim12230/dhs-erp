import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const { Title } = Typography;

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { loginId: string; password: string }) => {
    try {
      await login(values.loginId, values.password);
      message.success('로그인 성공');
      navigate('/dashboard');
    } catch {
      message.error('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 400, margin: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="DHS" style={{ height: 48, marginBottom: 12 }} />
          <br />
          <Typography.Text type="secondary">관리자 로그인</Typography.Text>
        </div>
        <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item name="loginId" rules={[{ required: true, message: '아이디를 입력하세요' }]}>
            <Input prefix={<UserOutlined />} placeholder="아이디" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
