import { Form, Input, Button, Card, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { loginSchema, type LoginFormData } from '../utils/validation';

const { Title } = Typography;

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
    loginMutation.mutate(data);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
        padding: 16,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          SQL Practice Admin
        </Title>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="이메일"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder="이메일을 입력하세요"
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="비밀번호"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="비밀번호를 입력하세요"
                />
              )}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
