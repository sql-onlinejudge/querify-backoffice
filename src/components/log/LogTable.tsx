import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { LogEntry } from '../../types';
import { LOG_LEVEL_CONFIG } from '../../utils/constants';
import { formatDate } from '../../utils/format';

const { Paragraph } = Typography;

interface LogTableProps {
  data: LogEntry[];
  loading: boolean;
}

export function LogTable({ data, loading }: LogTableProps) {
  const columns: ColumnsType<LogEntry> = [
    {
      title: '시간',
      dataIndex: '@timestamp',
      key: 'timestamp',
      width: 180,
      responsive: ['sm'],
      render: (date: string) => formatDate(date),
    },
    {
      title: '레벨',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: keyof typeof LOG_LEVEL_CONFIG) => (
        <Tag color={LOG_LEVEL_CONFIG[level]?.color}>{level}</Tag>
      ),
    },
    {
      title: '메시지',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => `${record['@timestamp']}-${record.message?.slice(0, 20)}`}
      loading={loading}
      scroll={{ x: 400 }}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      expandable={{
        expandedRowRender: (record) => (
          <div style={{ padding: '8px 0' }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {record.message}
            </Paragraph>
            {record.stack_trace && (
              <Paragraph
                style={{
                  whiteSpace: 'pre-wrap',
                  margin: '8px 0 0',
                  background: '#f5f5f5',
                  padding: 8,
                  fontSize: 12,
                }}
              >
                {record.stack_trace}
              </Paragraph>
            )}
          </div>
        ),
      }}
    />
  );
}
