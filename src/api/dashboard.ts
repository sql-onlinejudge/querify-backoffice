import apiClient from './client';
import type { Submission } from '../types';

export interface DailySubmission {
  date: string;
  count: number;
}

export interface DashboardStatistics {
  totalProblems: number;
  totalSubmissions: number;
  totalUsers: number;
  pendingCount: number;
  dailySubmissions: DailySubmission[];
}

export const dashboardApi = {
  getStatistics: async (): Promise<DashboardStatistics> => {
    const response = await apiClient.get<DashboardStatistics>(
      '/admin/dashboard/statistics'
    );
    return response.data;
  },

  getRecentSubmissions: async (limit = 10): Promise<Submission[]> => {
    const response = await apiClient.get<Submission[]>(
      '/admin/submissions/recent',
      { params: { limit } }
    );
    return response.data;
  },
};
