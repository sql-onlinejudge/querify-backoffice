import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { AdminLoginRequest, AdminLoginResponse } from '../types';

export const authApi = {
  login: async (data: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<AdminLoginResponse>(
      ENDPOINTS.auth.login,
      data
    );
    return response.data;
  },
};
