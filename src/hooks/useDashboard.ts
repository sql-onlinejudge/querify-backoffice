import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export function useDashboardStatistics() {
  return useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: () => dashboardApi.getStatistics(),
  });
}

export function useRecentSubmissions(limit = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recentSubmissions', limit],
    queryFn: () => dashboardApi.getRecentSubmissions(limit),
  });
}
