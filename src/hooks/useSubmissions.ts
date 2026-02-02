import { useQuery } from '@tanstack/react-query';
import { submissionsApi } from '../api/submissions';
import type { PaginationParams, SubmissionFilters } from '../types';

const queryKeys = {
  all: ['submissions'] as const,
  list: (filters?: PaginationParams & SubmissionFilters & { problemId?: number }) =>
    [...queryKeys.all, filters] as const,
  detail: (problemId: number, submissionId: number) =>
    [...queryKeys.all, problemId, submissionId] as const,
};

export function useSubmissions(
  params: PaginationParams & SubmissionFilters & { problemId?: number }
) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => submissionsApi.getAll(params),
  });
}

export function useSubmission(problemId: number, submissionId: number) {
  return useQuery({
    queryKey: queryKeys.detail(problemId, submissionId),
    queryFn: () => submissionsApi.getById(problemId, submissionId),
    enabled: problemId > 0 && submissionId > 0,
  });
}
