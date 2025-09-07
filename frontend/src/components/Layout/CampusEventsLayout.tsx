import React, { ReactNode } from 'react';
import { Layout, Button, Tooltip } from 'antd';
import { 
  DashboardOutlined,
  BankOutlined,
  TeamOutlined,
  CalendarOutlined,
  FormOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const { Header, Content } = Layout;

// Styled Components
const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  height: 64px;
  z-index: 10;
  position: sticky;
  top: 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 16px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  box-shadow: none;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
  }
  
  &.active {
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
  }
`;

const Logo = styled(motion.div)`
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0 16px;
  cursor: pointer;
`;

const MainContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', path: '/' },
  { key: 'colleges', icon: <BankOutlined />, label: 'Colleges', path: '/colleges' },
  { key: 'students', icon: <TeamOutlined />, label: 'Students', path: '/students' },
  { key: 'events', icon: <CalendarOutlined />, label: 'Events', path: '/events' },
  { key: 'registrations', icon: <FormOutlined />, label: 'Registrations', path: '/registrations' },
  { key: 'attendance', icon: <CheckCircleOutlined />, label: 'Attendance', path: '/attendance' },
  { key: 'feedback', icon: <MessageOutlined />, label: 'Feedback', path: '/feedback' },
  { key: 'reports', icon: <BarChartOutlined />, label: 'Reports', path: '/reports' },
];

interface CampusEventsLayoutProps {
  children: ReactNode;
}

const CampusEventsLayout: React.FC<CampusEventsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return (
    <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <StyledHeader>
        <HeaderContent>
          <Logo
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/')}
          >
            Campus Events
          </Logo>
          
          <NavButtons>
            {navItems.map((item) => (
              <Tooltip title={item.label} key={item.key} placement="bottom">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * navItems.findIndex(i => i.key === item.key) }}
                >
                  <StyledButton
                    type="text"
                    icon={item.icon}
                    className={isActive(item.path) ? 'active' : ''}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </StyledButton>
                </motion.div>
              </Tooltip>
            ))}
          </NavButtons>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledButton type="text" icon={<TeamOutlined />}>
              Admin
            </StyledButton>
          </motion.div>
        </HeaderContent>
      </StyledHeader>
      
      <Layout>
        <MainContent>
          {children}
        </MainContent>
      </Layout>
    </Layout>
  );
};

export default CampusEventsLayout;
