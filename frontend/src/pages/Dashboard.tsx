import React from 'react';
import { Row, Col, Typography } from 'antd';
import { 
  BankOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnimatedCard from '../components/ui/AnimatedCard';
import styled from 'styled-components';

const StatCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  
  .anticon {
    font-size: 24px;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 50%;
    background: ${props => props.color}15;
    color: ${props => props.color};
  }
  
  h3 {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .change {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #666;
    
    &.positive {
      color: #52c41a;
    }
    
    &.negative {
      color: #ff4d4f;
    }
  }
`;

const { Title } = Typography;

const Dashboard: React.FC = () => {
  // Sample data - replace with actual API calls
  const stats = [
    { title: 'Colleges', value: 5, icon: <BankOutlined />, color: '#1890ff' },
    { title: 'Students', value: 120, icon: <TeamOutlined />, color: '#52c41a' },
    { title: 'Events', value: 15, icon: <CalendarOutlined />, color: '#722ed1' },
    { title: 'Attendance', value: '85%', icon: <CheckCircleOutlined />, color: '#fa8c16' },
  ];

  // Sample chart data
  const data = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 20 },
    { name: 'Apr', value: 25 },
    { name: 'May', value: 30 },
    { name: 'Jun', value: 35 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>Dashboard</Typography.Title>
        <Typography.Text type="secondary">Welcome back! Here's what's happening.</Typography.Text>
      </div>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedCard hoverEffect animation="scale">
                <StatCard color={stat.color}>
                  {stat.icon}
                  <h3>{stat.title}</h3>
                  <div className="value">{stat.value}</div>
                  <div className={`change ${index % 2 === 0 ? 'positive' : 'negative'}`}>
                    {index % 2 === 0 ? (
                      <ArrowUpOutlined style={{ marginRight: 4 }} />
                    ) : (
                      <ArrowDownOutlined style={{ marginRight: 4 }} />
                    )}
                    {index % 2 === 0 ? '12%' : '5%'} from last month
                  </div>
                </StatCard>
              </AnimatedCard>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatedCard title="Events Overview" style={{ height: '100%' }} hoverEffect>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#666' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Events"
                      stroke="#1890ff"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#1890ff' }}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </motion.div>
        </Col>
        <Col xs={24} xl={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedCard 
              title="Quick Actions" 
              style={{ height: '100%' }} 
              hoverEffect
              extra={<a href="#">View All</a>}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Create New Event', 'Manage Registrations', 'View Reports', 'Send Notifications'].map((action, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 8,
                      background: i === 0 ? '#f0f7ff' : '#f9f9f9',
                      borderLeft: `3px solid ${i === 0 ? '#1890ff' : '#eee'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: 500, color: i === 0 ? '#1890ff' : '#333' }}>
                      {action}
                    </div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                      {i === 0 ? 'Create and schedule new campus events' : 'Click to view more details'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default Dashboard;
