import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import type { AdminLoginRequest } from '../types';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: AdminLoginRequest) => authApi.login(data),
    onSuccess: () => {
      login();
      navigate('/');
    },
    onError: () => {
      message.error('로그인에 실패했습니다');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    navigate('/login');
  };
}
