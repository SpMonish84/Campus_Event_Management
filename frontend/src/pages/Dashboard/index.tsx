import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, theme, Statistic, Progress, Tag } from 'antd';
import { 
  TeamOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  StarFilled,
  FireFilled,
  TrophyFilled
} from '@ant-design/icons';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement
);

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// Animation variants with proper TypeScript types
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      type: 'tween' as const,
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 100,
      damping: 10
    }
  })
};

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const StatCard = styled(motion(Card))`
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow);
  transition: var(--transition-normal);
  height: 100%;
  position: relative;
  overflow: hidden;
  background: white;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--primary-gradient);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    
    .stat-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  .ant-card-body {
    padding: 1.5rem;
    position: relative;
    z-index: 1;
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
    
    svg {
      margin-right: 0.25rem;
    }
  }
  
  .up {
    color: var(--success);
  }
  
  .down {
    color: var(--danger);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: ${props => `${props.color}10`};
  color: ${props => props.color};
  font-size: 24px;
  margin-bottom: 1rem;
  transition: var(--transition-normal);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: var(--radius-lg);
    background: ${props => `${props.color}05`};
    z-index: -1;
    transition: var(--transition-normal);
  }
  
  &.pulse {
    animation: ${pulse} 2s infinite;
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0.5rem 0 0.25rem;
  line-height: 1.2;
  
  .subtext {
    font-size: 0.875rem;
    color: var(--gray-500);
    font-weight: 400;
    margin-left: 0.25rem;
  }
`;

const StatLabel = styled(Text)`
  color: var(--gray-600);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const ChartContainer = styled(motion(Card))`
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow);
  height: 100%;
  background: white;
  transition: var(--transition-normal);
  overflow: hidden;
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  
  .ant-card-head {
    border: none;
    padding: 1.25rem 1.5rem 0;
    
    .ant-card-head-title {
      padding: 0;
    }
  }
  
  .ant-card-body {
    padding: 1rem 1.5rem 1.5rem;
  }
  
  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: var(--gray-600);
    
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      margin-right: 0.5rem;
    }
  }
`;

const ChartTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--gray-900);
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: var(--primary);
    }
  }
  
  .chart-actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      background: var(--gray-100);
      border: none;
      border-radius: var(--radius);
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--gray-600);
      cursor: pointer;
      transition: var(--transition-fast);
      
      &:hover {
        background: var(--gray-200);
      }
      
      &.active {
        background: var(--primary);
        color: white;
      }
    }
  }
`;

// Sample data
const recentActivities = [
  { id: 1, title: 'New event created', description: 'Annual Tech Conference 2023', time: '2 min ago', icon: <CalendarOutlined />, color: '#6366f1' },
  { id: 2, title: 'Registration completed', description: 'John Doe registered for Workshop', time: '10 min ago', icon: <UserAddOutlined />, color: '#10b981' },
  { id: 3, title: 'Payment received', description: '$250 for Tech Summit ticket', time: '1 hour ago', icon: <DollarOutlined />, color: '#8b5cf6' },
  { id: 4, title: 'New feedback received', description: '4.8/5 for Web Development Workshop', time: '3 hours ago', icon: <StarFilled />, color: '#f59e0b' },
];

const topEvents = [
  { id: 1, name: 'Annual Tech Conference', registrations: 245, progress: 82, color: '#6366f1' },
  { id: 2, name: 'Web Development Workshop', registrations: 189, progress: 63, color: '#8b5cf6' },
  { id: 3, name: 'AI & Machine Learning', registrations: 156, progress: 52, color: '#ec4899' },
  { id: 4, name: 'Blockchain Fundamentals', registrations: 98, progress: 32, color: '#f59e0b' },
];

const Dashboard: React.FC = () => {
  const { token } = useToken();
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Chart data
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Events',
        data: [12, 19, 8, 15, 12, 18, 25],
        borderColor: token.colorPrimary,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'Registrations',
        data: [8, 15, 5, 12, 10, 15, 20],
        borderColor: token.colorPrimary + '80',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Registrations',
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: [
          token.colorPrimary + '80',
          token.colorPrimary + '80',
          token.colorPrimary + '80',
          token.colorPrimary + '80',
          token.colorPrimary + '80',
          token.colorPrimary + '80',
          token.colorPrimary,
        ],
        borderColor: [
          token.colorPrimary,
          token.colorPrimary,
          token.colorPrimary,
          token.colorPrimary,
          token.colorPrimary,
          token.colorPrimary,
          token.colorPrimary,
        ],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Upcoming', 'Cancelled'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          token.colorPrimary,
          token.colorPrimary + '80',
          token.colorPrimary + '40',
          token.colorPrimary + '20',
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.03)',
        },
        ticks: {
          stepSize: 5,
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const stats = [
    {
      title: 'Total Students',
      value: '2,453',
      change: 12.5,
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      trend: 'up',
      description: 'Across all campuses',
    },
    {
      title: 'Upcoming Events',
      value: '24',
      change: 8.2,
      icon: <CalendarOutlined />,
      color: '#10b981',
      trend: 'up',
      description: 'Next 30 days',
    },
    {
      title: 'Attendance Rate',
      value: '86%',
      change: 3.1,
      icon: <CheckCircleOutlined />,
      color: '#3b82f6',
      trend: 'up',
      description: 'Average across events',
    },
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: -2.8,
      icon: <DollarOutlined />,
      color: '#8b5cf6',
      trend: 'down',
      description: 'This month',
    },
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex items-center gap-3
        ">
          <Tag icon={<ClockCircleOutlined />} color="blue">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Tag>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard
              hoverable
              className="h-full"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <StatLabel>
                    {stat.icon}
                    {stat.title}
                  </StatLabel>
                  <StatValue>
                    {stat.value}
                    {stat.description && (
                      <span className="subtext">
                        {stat.description}
                      </span>
                    )}
                  </StatValue>
                </div>
                <div className="flex items-center">
                  <Tag 
                    color={stat.trend === 'up' ? 'success' : 'error'} 
                    icon={stat.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    className="text-xs font-medium"
                  >
                    {Math.abs(stat.change)}%
                  </Tag>
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  percent={stat.trend === 'up' ? 75 : 40} 
                  showInfo={false} 
                  strokeColor={stat.color}
                  trailColor="#e5e7eb"
                  strokeWidth={4}
                />
              </div>
            </StatCard>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Events Overview Chart */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartContainer>
            <ChartTitle>
              <div>
                <CalendarOutlined />
                Events Overview
              </div>
              <div className="chart-actions">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    className={timeRange === range ? 'active' : ''}
                    onClick={() => setTimeRange(range)}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </ChartTitle>
            <div style={{ height: '300px' }}>
              <Line 
                data={lineChartData} 
                options={chartOptions} 
              />
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: token.colorPrimary }}></div>
                <span>Events</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ 
                  backgroundColor: token.colorPrimary + '80',
                  border: `1px dashed ${token.colorPrimary}`
                }}></div>
                <span>Registrations</span>
              </div>
            </div>
          </ChartContainer>
        </motion.div>
        
        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChartContainer>
            <ChartTitle>
              <div>
                <CheckCircleOutlined />
                Event Status
              </div>
            </ChartTitle>
            <div style={{ height: '300px', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: token.colorPrimary }}>85%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Completed</div>
              </div>
              <Doughnut 
                data={doughnutData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                  },
                }} 
              />
            </div>
          </ChartContainer>
        </motion.div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ChartContainer>
            <ChartTitle>
              <div>
                <FireFilled />
                Recent Activity
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-800">
                View All
              </button>
            </ChartTitle>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: activity.color + '20', color: activity.color }}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartContainer>
        </motion.div>
        
        {/* Top Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartContainer>
            <ChartTitle>
              <div>
                <TrophyFilled />
                Top Events
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-800">
                View All
              </button>
            </ChartTitle>
            <div className="space-y-4">
              {topEvents.map((event, index) => (
                <div key={event.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900 truncate pr-2">{event.name}</span>
                    <span className="text-gray-500">{event.registrations} reg.</span>
                  </div>
                  <Progress 
                    percent={event.progress} 
                    showInfo={false} 
                    strokeColor={event.color}
                    trailColor="#e5e7eb"
                    strokeWidth={6}
                    className="m-0"
                  />
                </div>
              ))}
            </div>
          </ChartContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
