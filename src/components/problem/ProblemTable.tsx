import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { ProblemListItem } from '../../types';
import { DifficultyTag } from './DifficultyTag';
import { formatDateShort } from '../../utils/format';
import { showConfirmModal } from '../common/ConfirmModal';

interface ProblemTableProps {
  data: ProblemListItem[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onDelete: (id: number) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export function ProblemTable({
  data,
  loading,
  pagination,
  onDelete,
  onPaginationChange,
}: ProblemTableProps) {
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    showConfirmModal({
      title: '문제 삭제',
      content: '정말 삭제하시겠습니까?',
      onConfirm: () => onDelete(id),
    });
  };

  const columns: ColumnsType<ProblemListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      fixed: 'left',
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '난이도',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      sorter: true,
      responsive: ['sm'],
      render: (difficulty: 1 | 2 | 3 | 4 | 5) => (
        <DifficultyTag level={difficulty} />
      ),
    },
    {
      title: '제출수',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
      width: 100,
      sorter: true,
      responsive: ['md'],
    },
    {
      title: '정답률',
      key: 'acceptRate',
      width: 100,
      responsive: ['md'],
      render: (_, record) => {
        if (record.submissionCount === 0) return '-';
        const rate = (record.solvedCount / record.submissionCount) * 100;
        return `${rate.toFixed(1)}%`;
      },
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: true,
      responsive: ['lg'],
      render: (date: string) => formatDateShort(date),
    },
    {
      title: '액션',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/problems/${record.id}`);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 600 }}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total) => `총 ${total}개`,
        onChange: onPaginationChange,
      }}
      onRow={(record) => ({
        onClick: () => navigate(`/problems/${record.id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
}
