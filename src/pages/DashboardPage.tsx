import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import {
  FileTextOutlined,
  SendOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDashboardStatistics, useRecentSubmissions } from '../hooks/useDashboard';
import { VerdictTag } from '../components/submission/VerdictTag';
import { StatusTag } from '../components/submission/StatusTag';
import { formatDate } from '../utils/format';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { Submission } from '../types';

const { Title } = Typography;

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: statistics, isLoading: statsLoading } = useDashboardStatistics();
  const { data: recentSubmissions, isLoading: submissionsLoading } = useRecentSubmissions(10);

  if (statsLoading) {
    return <LoadingSpinner />;
  }

  const chartData = statistics?.dailySubmissions.map((item) => ({
    date: item.date.slice(5),
    count: item.count,
  })) || [];

  const submissionColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '문제', dataIndex: 'problemId', key: 'problemId', width: 80 },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Submission['status']) => <StatusTag status={status} />,
    },
    {
      title: '결과',
      dataIndex: 'verdict',
      key: 'verdict',
      width: 100,
      render: (verdict: Submission['verdict']) => <VerdictTag verdict={verdict} />,
    },
    {
      title: '제출시간',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>대시보드</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 문제 수"
              value={statistics?.totalProblems || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 제출 수"
              value={statistics?.totalSubmissions || 0}
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 사용자 수"
              value={statistics?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="채점 대기"
              value={statistics?.pendingCount || 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="최근 7일 제출 현황">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="최근 제출"
            extra={
              <a onClick={() => navigate('/submissions')}>더보기</a>
            }
          >
            <Table
              columns={submissionColumns}
              dataSource={recentSubmissions || []}
              rowKey="id"
              pagination={false}
              size="small"
              loading={submissionsLoading}
              locale={{ emptyText: '제출 내역이 없습니다' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
