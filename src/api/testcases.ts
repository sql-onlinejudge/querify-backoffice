import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  CreateTestcaseRequest,
  Testcase,
  UpdateTestcaseRequest,
} from '../types';

export const testcasesApi = {
  getAll: async (problemId: number): Promise<Testcase[]> => {
    const response = await apiClient.get<Testcase[]>(
      ENDPOINTS.testcases.base(problemId)
    );
    return response.data;
  },

  getById: async (problemId: number, testcaseId: number): Promise<Testcase> => {
    const response = await apiClient.get<Testcase>(
      ENDPOINTS.testcases.byId(problemId, testcaseId)
    );
    return response.data;
  },

  create: async (
    problemId: number,
    data: CreateTestcaseRequest
  ): Promise<void> => {
    await apiClient.post(ENDPOINTS.testcases.base(problemId), data);
  },

  update: async (
    problemId: number,
    testcaseId: number,
    data: UpdateTestcaseRequest
  ): Promise<void> => {
    await apiClient.patch(
      ENDPOINTS.testcases.byId(problemId, testcaseId),
      data
    );
  },

  delete: async (problemId: number, testcaseId: number): Promise<void> => {
    await apiClient.delete(ENDPOINTS.testcases.byId(problemId, testcaseId));
  },
};
