import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemListPage } from './pages/problem/ProblemListPage';
import { ProblemCreatePage } from './pages/problem/ProblemCreatePage';
import { ProblemDetailPage } from './pages/problem/ProblemDetailPage';
import { SubmissionListPage } from './pages/submission/SubmissionListPage';
import { SubmissionDetailPage } from './pages/submission/SubmissionDetailPage';
import { LogMonitorPage } from './pages/log/LogMonitorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/problems" element={<ProblemListPage />} />
                <Route path="/problems/create" element={<ProblemCreatePage />} />
                <Route path="/problems/:id" element={<ProblemDetailPage />} />
                <Route path="/submissions" element={<SubmissionListPage />} />
                <Route
                  path="/submissions/:problemId/:submissionId"
                  element={<SubmissionDetailPage />}
                />
                <Route path="/logs" element={<LogMonitorPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
