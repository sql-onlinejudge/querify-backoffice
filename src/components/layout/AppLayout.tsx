import { useState } from 'react';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  SendOutlined,
  MonitorOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '대시보드',
  },
  {
    key: '/problems',
    icon: <FileTextOutlined />,
    label: '문제 관리',
  },
  {
    key: '/submissions',
    icon: <SendOutlined />,
    label: '제출 관리',
  },
  {
    key: '/logs',
    icon: <MonitorOutlined />,
    label: '로그 모니터링',
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getSelectedKey = () => {
    if (location.pathname === '/') return '/';
    const match = menuItems.find(
      (item) => item.key !== '/' && location.pathname.startsWith(item.key)
    );
    return match?.key || '/';
  };

  const handleMenuClick = (key: string) => {
    navigate(key);
    if (isMobile) setDrawerOpen(false);
  };

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      onClick={({ key }) => handleMenuClick(key)}
    />
  );

  const logoSection = (
    <div
      style={{
        height: 64,
        padding: 16,
        fontWeight: 'bold',
        fontSize: 18,
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      SQL Practice Admin
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={220}
          styles={{ body: { padding: 0 } }}
        >
          {logoSection}
          {menuContent}
        </Drawer>
      ) : (
        <Sider theme="light" width={220} collapsible breakpoint="lg" collapsedWidth={80}>
          {logoSection}
          {menuContent}
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: isMobile ? '0 16px' : '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          ) : (
            <div />
          )}
          <LogoutOutlined
            onClick={logout}
            style={{ fontSize: 18, cursor: 'pointer' }}
          />
        </Header>
        <Content
          style={{
            margin: isMobile ? 12 : 24,
            padding: isMobile ? 16 : 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
