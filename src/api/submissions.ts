import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type {
  PaginatedResponse,
  PaginationParams,
  Submission,
  SubmissionDetail,
  SubmissionFilters,
} from '../types';

interface SubmissionsResponse {
  submissions: Submission[];
  totalCount: number;
  page: number;
  size: number;
}

export const submissionsApi = {
  getAll: async (
    params: PaginationParams & SubmissionFilters & { problemId?: number }
  ): Promise<PaginatedResponse<Submission>> => {
    const response = await apiClient.get<SubmissionsResponse>(
      ENDPOINTS.submissions.base,
      { params }
    );
    const { submissions, totalCount, page, size } = response.data;
    return {
      content: submissions,
      totalElements: totalCount,
      page,
      size,
      totalPages: Math.ceil(totalCount / size),
      last: (page + 1) * size >= totalCount,
    };
  },

  getById: async (
    problemId: number,
    submissionId: number
  ): Promise<SubmissionDetail> => {
    const response = await apiClient.get<SubmissionDetail>(
      ENDPOINTS.submissions.byId(problemId, submissionId)
    );
    return response.data;
  },
};
