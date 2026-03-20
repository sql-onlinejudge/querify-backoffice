import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateProblemRequest,
  PaginatedResponse,
  PaginationParams,
  Problem,
  ProblemFilters,
  ProblemListItem,
  UpdateProblemRequest,
} from '../types';

export interface ReindexResponse {
  success: boolean;
  indexed?: number;
  message?: string;
  error?: string;
  type?: string;
}

export const problemsApi = {
  getAll: async (
    params: PaginationParams & ProblemFilters
  ): Promise<PaginatedResponse<ProblemListItem>> => {
    const response = await apiClient.get<PaginatedResponse<ProblemListItem>>(
      ENDPOINTS.problems.base,
      { params }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Problem> => {
    const response = await apiClient.get<Problem>(ENDPOINTS.problems.byId(id));
    return response.data;
  },

  create: async (data: CreateProblemRequest): Promise<void> => {
    await apiClient.post(ENDPOINTS.problems.base, data);
  },

  update: async (id: number, data: UpdateProblemRequest): Promise<void> => {
    await apiClient.patch(ENDPOINTS.problems.byId(id), data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.problems.byId(id));
  },

  reindex: async (): Promise<ReindexResponse> => {
    const response = await apiClient.post<ReindexResponse>(ENDPOINTS.admin.reindex);
    return response.data;
  },
};
