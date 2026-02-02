import { useState } from 'react';
import { Select, Space } from 'antd';
import { PageHeader } from '../../components/common/PageHeader';
import { SubmissionTable } from '../../components/submission/SubmissionTable';
import { useProblems } from '../../hooks/useProblems';
import { useSubmissions } from '../../hooks/useSubmissions';
import type { SubmissionStatus, SubmissionVerdict } from '../../types';

export function SubmissionListPage() {
  const [selectedProblem, setSelectedProblem] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<SubmissionStatus | undefined>();
  const [verdict, setVerdict] = useState<SubmissionVerdict | undefined>();

  const { data: problemsData, isLoading: problemsLoading } = useProblems({
    page: 0,
    size: 1000,
  });

  const { data, isLoading } = useSubmissions({
    page,
    size: pageSize,
    problemId: selectedProblem,
    status,
    verdict,
  });

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage - 1);
    setPageSize(newPageSize);
  };

  const problemOptions =
    problemsData?.content.map((p) => ({
      label: `#${p.id} ${p.title}`,
      value: p.id,
    })) || [];

  return (
    <div>
      <PageHeader title="제출 관리" />

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="전체 문제"
          allowClear
          style={{ width: 300, minWidth: 200, maxWidth: '100%' }}
          loading={problemsLoading}
          options={problemOptions}
          onChange={(value) => {
            setSelectedProblem(value);
            setPage(0);
          }}
          showSearch
          filterOption={(input, option) =>
            (option?.label?.toString() || '').toLowerCase().includes(input.toLowerCase())
          }
        />
        <Select
          placeholder="상태"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => {
            setStatus(value);
            setPage(0);
          }}
          options={[
            { label: '대기중', value: 'PENDING' },
            { label: '채점중', value: 'RUNNING' },
            { label: '완료', value: 'COMPLETED' },
          ]}
        />
        <Select
          placeholder="결과"
          allowClear
          style={{ width: 140 }}
          onChange={(value) => {
            setVerdict(value);
            setPage(0);
          }}
          options={[
            { label: '정답', value: 'ACCEPTED' },
            { label: '오답', value: 'WRONG_ANSWER' },
            { label: '시간 초과', value: 'TIME_LIMIT_EXCEEDED' },
            { label: '런타임 에러', value: 'RUNTIME_ERROR' },
            { label: '잘못된 쿼리', value: 'INVALID_QUERY' },
          ]}
        />
      </Space>

      <SubmissionTable
        data={data?.content || []}
        loading={isLoading}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements || 0,
        }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
