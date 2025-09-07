import React, { useState } from 'react';
import { Table, Card, Typography, Input, Rate, Tag, Space, Button, Select } from 'antd';
import { SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Feedback {
  feedback_id: number;
  event_id: number;
  event_title: string;
  student_id: number;
  student_name: string;
  rating: number;
  comment: string;
  submitted_at: string;
  status: 'pending' | 'reviewed';
}

const Feedback: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with API calls
  const [feedback, setFeedback] = useState<Feedback[]>([
    {
      feedback_id: 1,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 101,
      student_name: 'John Doe',
      rating: 5,
      comment: 'Great event with insightful sessions!',
      submitted_at: '2023-12-16T10:30:00',
      status: 'reviewed'
    },
    {
      feedback_id: 2,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 102,
      student_name: 'Jane Smith',
      rating: 4,
      comment: 'Good event, but could have more hands-on activities.',
      submitted_at: '2023-12-16T11:15:00',
      status: 'pending'
    },
    {
      feedback_id: 3,
      event_id: 2,
      event_title: 'Coding Workshop',
      student_id: 101,
      student_name: 'John Doe',
      rating: 3,
      comment: 'The workshop was okay, but the content was too basic.',
      submitted_at: '2023-12-11T14:20:00',
      status: 'reviewed'
    },
  ]);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.event_title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || item.rating === ratingFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleStatusChange = (id: number, newStatus: 'pending' | 'reviewed') => {
    setFeedback(feedback.map(item => 
      item.feedback_id === id ? { ...item, status: newStatus } : item
    ));
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event_title',
      key: 'event',
      render: (text: string, record: Feedback) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">ID: {record.event_id}</Text>
        </Space>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'student_name',
      key: 'student',
      render: (text: string, record: Feedback) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Text type="secondary">ID: {record.student_id}</Text>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Rate 
          value={rating} 
          disabled 
          character={({ index = 0 }) => 
            index < rating ? <StarFilled /> : <StarOutlined />
          }
        />
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => (
        <Text 
          ellipsis={{ 
            tooltip: text
          }}
          style={{ maxWidth: 300 }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted_at',
      key: 'submitted',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Feedback) => (
        <Space>
          <Tag color={status === 'reviewed' ? 'green' : 'orange'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
          {status === 'pending' && (
            <Button 
              size="small" 
              type="link"
              onClick={() => handleStatusChange(record.feedback_id, 'reviewed')}
            >
              Mark as Reviewed
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3}>Event Feedback</Title>
        <Space>
          <Input
            placeholder="Search feedback..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Filter by rating"
            style={{ width: 150 }}
            value={ratingFilter}
            onChange={setRatingFilter}
            allowClear
          >
            <Option value="all">All Ratings</Option>
            {[5, 4, 3, 2, 1].map(rating => (
              <Option key={rating} value={rating}>
                <Rate 
                  disabled 
                  value={rating} 
                  style={{ fontSize: 14 }} 
                  character={({ index = 0 }) => 
                    index < rating ? <StarFilled /> : <StarOutlined />
                  }
                />
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="reviewed">Reviewed</Option>
          </Select>
        </Space>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredFeedback} 
          rowKey="feedback_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Feedback;
