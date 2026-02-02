import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Testcase } from '../../types';
import { showConfirmModal } from '../common/ConfirmModal';

interface TestcaseListProps {
  data: Testcase[];
  loading: boolean;
  onEdit: (testcase: Testcase) => void;
  onDelete: (id: number) => void;
}

export function TestcaseList({ data, loading, onEdit, onDelete }: TestcaseListProps) {
  const handleDelete = (id: number) => {
    showConfirmModal({
      title: '테스트케이스 삭제',
      content: '정말 삭제하시겠습니까?',
      onConfirm: () => onDelete(id),
    });
  };

  const columns: ColumnsType<Testcase> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '초기 데이터',
      key: 'initData',
      ellipsis: true,
      render: (_, record) => {
        const tables = record.initData?.statements?.map((s) => s.table) || [];
        return tables.join(', ') || '-';
      },
    },
    {
      title: '정답 컬럼',
      key: 'answerColumns',
      ellipsis: true,
      responsive: ['md'],
      render: (_, record) => {
        const cols = record.answerData?.columns || [];
        return cols.join(', ') || '-';
      },
    },
    {
      title: '정답 행 수',
      key: 'answerRows',
      width: 100,
      responsive: ['sm'],
      render: (_, record) => record.answerData?.rows?.length || 0,
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
            onClick={() => onEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
      scroll={{ x: 400 }}
      pagination={false}
    />
  );
}
