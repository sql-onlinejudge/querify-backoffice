import { Table, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Submission } from '../../types';
import { VerdictTag } from './VerdictTag';
import { StatusTag } from './StatusTag';
import { formatDate, maskUserId } from '../../utils/format';

interface SubmissionTableProps {
  data: Submission[];
  loading: boolean;
  pagination?: TablePaginationConfig;
  onPaginationChange?: (page: number, pageSize: number) => void;
  showActions?: boolean;
}

export function SubmissionTable({
  data,
  loading,
  pagination,
  onPaginationChange,
  showActions = true,
}: SubmissionTableProps) {
  const navigate = useNavigate();

  const columns: ColumnsType<Submission> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '사용자',
      dataIndex: 'userId',
      key: 'userId',
      width: 150,
      responsive: ['md'],
      render: (userId: string) => maskUserId(userId),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: '결과',
      dataIndex: 'verdict',
      key: 'verdict',
      width: 120,
      render: (verdict) => <VerdictTag verdict={verdict} />,
    },
    {
      title: '제출시간',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      responsive: ['sm'],
      render: (date: string) => formatDate(date),
    },
  ];

  if (showActions) {
    columns.push({
      title: '액션',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(`/submissions/${record.problemId}/${record.id}`)
          }
        />
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 500 }}
      pagination={
        pagination
          ? {
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `총 ${total}개`,
              onChange: onPaginationChange,
            }
          : false
      }
    />
  );
}
