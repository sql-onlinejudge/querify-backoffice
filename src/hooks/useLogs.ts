import { useQuery } from '@tanstack/react-query';
import { elasticsearchApi } from '../api/elasticsearch';
import type { LogSearchParams } from '../types';

const queryKeys = {
  all: ['logs'] as const,
  search: (params: LogSearchParams) => [...queryKeys.all, params] as const,
};

export function useLogs(params: LogSearchParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.search(params),
    queryFn: () => elasticsearchApi.searchLogs(params),
    enabled,
    refetchOnWindowFocus: false,
  });
}
