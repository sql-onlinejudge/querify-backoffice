import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { testcasesApi } from '../api/testcases';
import type { CreateTestcaseRequest, UpdateTestcaseRequest } from '../types';

const queryKeys = {
  all: ['testcases'] as const,
  list: (problemId: number) => [...queryKeys.all, problemId] as const,
  detail: (problemId: number, testcaseId: number) =>
    [...queryKeys.list(problemId), testcaseId] as const,
};

export function useTestcases(problemId: number) {
  return useQuery({
    queryKey: queryKeys.list(problemId),
    queryFn: () => testcasesApi.getAll(problemId),
    enabled: problemId > 0,
  });
}

export function useTestcase(problemId: number, testcaseId: number) {
  return useQuery({
    queryKey: queryKeys.detail(problemId, testcaseId),
    queryFn: () => testcasesApi.getById(problemId, testcaseId),
    enabled: problemId > 0 && testcaseId > 0,
  });
}

export function useCreateTestcase(problemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestcaseRequest) =>
      testcasesApi.create(problemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(problemId) });
      message.success('테스트케이스가 생성되었습니다');
    },
    onError: () => {
      message.error('테스트케이스 생성에 실패했습니다');
    },
  });
}

export function useUpdateTestcase(problemId: number, testcaseId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTestcaseRequest) =>
      testcasesApi.update(problemId, testcaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(problemId) });
      message.success('테스트케이스가 수정되었습니다');
    },
    onError: () => {
      message.error('테스트케이스 수정에 실패했습니다');
    },
  });
}

export function useDeleteTestcase(problemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testcaseId: number) =>
      testcasesApi.delete(problemId, testcaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(problemId) });
      message.success('테스트케이스가 삭제되었습니다');
    },
    onError: () => {
      message.error('테스트케이스 삭제에 실패했습니다');
    },
  });
}
