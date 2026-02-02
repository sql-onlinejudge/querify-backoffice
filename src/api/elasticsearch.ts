import type { LogEntry, LogSearchParams } from '../types';

const indexMap: Record<string, string> = {
  api: 'api-logs-*',
  judge: 'judge-logs-*',
  app: 'app-logs-*',
};

export const elasticsearchApi = {
  searchLogs: async (params: LogSearchParams): Promise<LogEntry[]> => {
    const index = indexMap[params.index];

    const query = {
      query: {
        bool: {
          must: [
            {
              range: {
                '@timestamp': {
                  gte: params.startTime,
                  lte: params.endTime,
                },
              },
            },
            ...(params.keyword
              ? [{ match: { message: params.keyword } }]
              : []),
          ],
          ...(params.level && {
            filter: [{ term: { level: params.level } }],
          }),
        },
      },
      sort: [{ '@timestamp': 'desc' }],
      size: params.size || 100,
    };

    const response = await fetch(`/es/${index}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    return data.hits?.hits?.map((hit: { _source: LogEntry }) => hit._source) || [];
  },
};
