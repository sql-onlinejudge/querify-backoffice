import { Button, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  backPath?: string;
  extra?: React.ReactNode;
}

export function PageHeader({ title, backPath, extra }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space>
        {backPath && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(backPath)}
          />
        )}
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      </Space>
      {extra && <Space>{extra}</Space>}
    </div>
  );
}
