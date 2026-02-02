import { Form, Select, Input, DatePicker, Button, Row, Col, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import type { LogLevel } from '../../types';

const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

interface LogFilterValues {
  level?: LogLevel;
  keyword?: string;
  timeRange?: [Dayjs, Dayjs];
}

interface LogFilterProps {
  onSearch: (values: LogFilterValues) => void;
  loading?: boolean;
}

export function LogFilter({ onSearch, loading }: LogFilterProps) {
  const [form] = Form.useForm<LogFilterValues>();
  const screens = useBreakpoint();

  const handleSubmit = (values: LogFilterValues) => {
    onSearch(values);
  };

  return (
    <Form
      form={form}
      layout={screens.md ? 'inline' : 'vertical'}
      onFinish={handleSubmit}
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[8, 8]} align="bottom" style={{ width: '100%' }}>
        <Col xs={24} md={8}>
          <Form.Item name="timeRange" label="시간 범위" style={{ marginBottom: screens.md ? 0 : 8 }}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={12} md={4}>
          <Form.Item name="level" label="로그 레벨" style={{ marginBottom: screens.md ? 0 : 8 }}>
            <Select
              placeholder="전체"
              allowClear
              style={{ width: '100%' }}
              options={[
                { label: 'DEBUG', value: 'DEBUG' },
                { label: 'INFO', value: 'INFO' },
                { label: 'WARN', value: 'WARN' },
                { label: 'ERROR', value: 'ERROR' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item name="keyword" label="키워드" style={{ marginBottom: screens.md ? 0 : 8 }}>
            <Input placeholder="검색어 입력" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={4}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={loading}
              block={!screens.md}
            >
              검색
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
