import { useState } from 'react';
import { Tabs, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/common/PageHeader';
import { LogFilter } from '../../components/log/LogFilter';
import { LogTable } from '../../components/log/LogTable';
import { useLogs } from '../../hooks/useLogs';
import type { LogType, LogLevel, LogSearchParams } from '../../types';

export function LogMonitorPage() {
  const [activeTab, setActiveTab] = useState<LogType>('api');
  const [searchParams, setSearchParams] = useState<LogSearchParams>({
    index: 'api',
    startTime: dayjs().subtract(1, 'hour').toISOString(),
    endTime: dayjs().toISOString(),
  });

  const { data: logs, isLoading, refetch } = useLogs(searchParams);

  const handleSearch = (values: {
    level?: LogLevel;
    keyword?: string;
    timeRange?: [dayjs.Dayjs, dayjs.Dayjs];
  }) => {
    const newParams: LogSearchParams = {
      index: activeTab,
      startTime: values.timeRange?.[0]?.toISOString() || dayjs().subtract(1, 'hour').toISOString(),
      endTime: values.timeRange?.[1]?.toISOString() || dayjs().toISOString(),
      level: values.level,
      keyword: values.keyword,
    };
    setSearchParams(newParams);
    refetch();
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as LogType);
    setSearchParams((prev) => ({ ...prev, index: key as LogType }));
  };

  const kibanaUrl = import.meta.env.VITE_KIBANA_URL;

  const tabItems = [
    { key: 'api', label: 'API 로그' },
    { key: 'judge', label: '채점 로그' },
    { key: 'app', label: '앱 로그' },
  ];

  return (
    <div>
      <PageHeader
        title="로그 모니터링"
        extra={
          kibanaUrl && (
            <Button
              icon={<LinkOutlined />}
              href={kibanaUrl}
              target="_blank"
            >
              Kibana에서 보기
            </Button>
          )
        }
      />

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
      />

      <LogFilter onSearch={handleSearch} loading={isLoading} />

      <LogTable data={logs || []} loading={isLoading} />
    </div>
  );
}
