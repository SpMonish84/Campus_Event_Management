import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Select, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Table, 
  Statistic,
  Progress,
  Space
} from 'antd';
import { 
  DownloadOutlined, 
  BarChartOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  StarFilled
} from '@ant-design/icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Sample data for charts and reports
const eventData = [
  { month: 'Jan', events: 3 },
  { month: 'Feb', events: 5 },
  { month: 'Mar', events: 7 },
  { month: 'Apr', events: 4 },
  { month: 'May', events: 6 },
  { month: 'Jun', events: 8 },
];

const attendanceData = [
  { type: 'Present', value: 78 },
  { type: 'Absent', value: 15 },
  { type: 'Late', value: 7 },
];

const feedbackData = [
  { rating: 5, count: 120 },
  { rating: 4, count: 85 },
  { rating: 3, count: 45 },
  { rating: 2, count: 20 },
  { rating: 1, count: 10 },
];

const recentEvents = [
  { 
    id: 1, 
    title: 'Tech Symposium', 
    date: '2023-12-15', 
    attendees: 150, 
    capacity: 200,
    rating: 4.5
  },
  { 
    id: 2, 
    title: 'Coding Workshop', 
    date: '2023-12-10', 
    attendees: 25, 
    capacity: 30,
    rating: 4.2
  },
  { 
    id: 3, 
    title: 'Career Fair', 
    date: '2023-11-28', 
    attendees: 180, 
    capacity: 200,
    rating: 4.7
  },
];

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const COLORS = ['#1890ff', '#52c41a', '#ff4d4f', '#faad14', '#722ed1', '#13c2c2'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (record: any) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            {record.attendees} / {record.capacity} attendees
          </div>
          <Progress 
            percent={Math.round((record.attendees / record.capacity) * 100)} 
            size="small" 
            showInfo={false}
          />
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          {renderRating(rating)}
        </Space>
      ),
    },
  ];

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= Math.floor(rating) ? '#faad14' : '#d9d9d9' }}>
          ★
        </span>
      );
    }
    return <span>{stars} {rating.toFixed(1)}</span>;
  };

  const stats = [
    { value: 15, title: 'Total Events', icon: <CalendarOutlined /> },
    { value: 1245, title: 'Total Participants', icon: <TeamOutlined /> },
    { value: 85, title: 'Average Attendance', suffix: '%', icon: <CheckCircleOutlined /> },
    { value: 4.3, title: 'Average Rating', icon: <span style={{ color: '#faad14' }}>★</span> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3}>Reports & Analytics</Title>
        <Space>
          <Select
            defaultValue="overview"
            style={{ width: 200 }}
            onChange={setReportType}
          >
            <Option value="overview">Overview</Option>
            <Option value="events">Events Report</Option>
            <Option value="attendance">Attendance Report</Option>
            <Option value="feedback">Feedback Report</Option>
          </Select>
          <RangePicker 
            style={{ width: 250 }} 
            onChange={(dates) => setDateRange(dates)}
          />
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            loading={loading}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </Space>
      </div>

      {reportType === 'overview' && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {stat.value}{stat.suffix || ''}
                    </div>
                    <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{stat.title}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} xl={16}>
              <Card title="Events Overview">
                <ResponsiveContainer width="100%" height={400}>
                <BarChart data={eventData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="events" fill="#1890ff" name="Number of Events" />
                </BarChart>
              </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Card title="Attendance Distribution">
                <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="type"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title="Recent Events">
            <Table 
              columns={columns} 
              dataSource={recentEvents} 
              rowKey="id"
              pagination={false}
            />
          </Card>
        </>
      )}

      {reportType === 'events' && (
        <Card title="Events Report">
          <p>Detailed events report will be displayed here.</p>
          <p>Filtered by: {dateRange ? `${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}` : 'All dates'}</p>
        </Card>
      )}

      {reportType === 'attendance' && (
        <Card title="Attendance Report">
          <p>Detailed attendance report will be displayed here.</p>
          <p>Filtered by: {dateRange ? `${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}` : 'All dates'}</p>
        </Card>
      )}

      {reportType === 'feedback' && (
        <Card title="Feedback Report">
          <p>Detailed feedback report will be displayed here.</p>
          <p>Filtered by: {dateRange ? `${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}` : 'All dates'}</p>
        </Card>
      )}
    </div>
  );
};

export default Reports;
