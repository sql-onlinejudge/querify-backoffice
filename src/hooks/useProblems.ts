import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { problemsApi, type ReindexResponse } from '../api/problems';
import type {
  CreateProblemRequest,
  PaginationParams,
  ProblemFilters,
  UpdateProblemRequest,
} from '../types';

const queryKeys = {
  all: ['problems'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: PaginationParams & ProblemFilters) =>
    [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
};

export function useProblems(params: PaginationParams & ProblemFilters) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => problemsApi.getAll(params),
  });
}

export function useProblem(id: number) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: () => problemsApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProblemRequest) => problemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      message.success('문제가 생성되었습니다');
    },
    onError: () => {
      message.error('문제 생성에 실패했습니다');
    },
  });
}

export function useUpdateProblem(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProblemRequest) => problemsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      message.success('문제가 수정되었습니다');
    },
    onError: () => {
      message.error('문제 수정에 실패했습니다');
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => problemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      message.success('문제가 삭제되었습니다');
    },
    onError: () => {
      message.error('문제 삭제에 실패했습니다');
    },
  });
}

export function useReindexProblems() {
  return useMutation<ReindexResponse, Error>({
    mutationFn: () => problemsApi.reindex(),
    onSuccess: (data) => {
      if (data.success) {
        message.success(data.message ?? '재인덱싱이 완료되었습니다');
      } else {
        message.error(data.error ?? '재인덱싱에 실패했습니다');
      }
    },
    onError: () => {
      message.error('재인덱싱에 실패했습니다');
    },
  });
}
