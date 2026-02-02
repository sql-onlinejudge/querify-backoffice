import { useState } from 'react';
import { Button, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { ProblemTable } from '../../components/problem/ProblemTable';
import { useProblems, useDeleteProblem } from '../../hooks/useProblems';

const { Search } = Input;

export function ProblemListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [difficulty, setDifficulty] = useState<number | undefined>();

  const { data, isLoading } = useProblems({
    page,
    size: pageSize,
    keyword: keyword || undefined,
    minDifficulty: difficulty,
    maxDifficulty: difficulty,
  });

  const deleteMutation = useDeleteProblem();

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage - 1);
    setPageSize(newPageSize);
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handleDifficultyChange = (value: number | undefined) => {
    setDifficulty(value);
    setPage(0);
  };

  return (
    <div>
      <PageHeader
        title="문제 관리"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/problems/create')}
          >
            문제 생성
          </Button>
        }
      />

      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="제목 검색"
          allowClear
          onSearch={handleSearch}
          style={{ width: 250, minWidth: 200 }}
        />
        <Select
          placeholder="난이도"
          allowClear
          style={{ width: 120 }}
          onChange={handleDifficultyChange}
          options={[
            { label: 'Level 1', value: 1 },
            { label: 'Level 2', value: 2 },
            { label: 'Level 3', value: 3 },
            { label: 'Level 4', value: 4 },
            { label: 'Level 5', value: 5 },
          ]}
        />
      </Space>

      <ProblemTable
        data={data?.content || []}
        loading={isLoading}
        pagination={{
          current: page + 1,
          pageSize,
          total: data?.totalElements || 0,
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
