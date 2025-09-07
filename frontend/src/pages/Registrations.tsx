import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Select, Badge, message } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Registration {
  registration_id: number;
  event_id: number;
  event_title: string;
  student_id: number;
  student_name: string;
  registration_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const Registrations: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - replace with API calls
  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      registration_id: 1,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 101,
      student_name: 'John Doe',
      registration_date: '2023-12-01T10:30:00',
      status: 'confirmed'
    },
    {
      registration_id: 2,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 102,
      student_name: 'Jane Smith',
      registration_date: '2023-12-02T14:45:00',
      status: 'pending'
    },
    {
      registration_id: 3,
      event_id: 2,
      event_title: 'Coding Workshop',
      student_id: 101,
      student_name: 'John Doe',
      registration_date: '2023-12-05T09:15:00',
      status: 'cancelled'
    },
  ]);

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
      reg.event_title.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: number, newStatus: 'confirmed' | 'cancelled') => {
    setRegistrations(registrations.map(reg => 
      reg.registration_id === id ? { ...reg, status: newStatus } : reg
    ));
    message.success('Registration updated successfully');
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>Confirmed</Tag>;
      case 'pending':
        return <Tag color="processing">Pending</Tag>;
      case 'cancelled':
        return <Tag color="error" icon={<CloseCircleOutlined />}>Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event_title',
      key: 'event',
      render: (text: string, record: Registration) => (
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
      render: (text: string, record: Registration) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Text type="secondary">ID: {record.student_id}</Text>
        </Space>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'registration_date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Registration) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getStatusTag(status)}
          {status === 'pending' && (
            <Space size="small">
              <Button 
                size="small" 
                type="text" 
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleStatusChange(record.registration_id, 'confirmed')}
              />
              <Button 
                size="small" 
                type="text" 
                danger 
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusChange(record.registration_id, 'cancelled')}
              />
            </Space>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Registration) => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3}>Event Registrations</Title>
        <Space>
          <Input
            placeholder="Search registrations..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Space>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredRegistrations} 
          rowKey="registration_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Registrations;
