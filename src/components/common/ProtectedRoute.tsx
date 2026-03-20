import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';

export function ProtectedRoute() {
  const { isAuthenticated, login } = useAuthStore();
  const [checking, setChecking] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;

    authApi.me()
      .then(() => {
        login();
      })
      .catch(() => {})
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
