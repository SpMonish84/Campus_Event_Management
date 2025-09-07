import React, { useState } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, Select, Card, Typography, Tag, 
  DatePicker, TimePicker, InputNumber, message, Badge
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, 
  CalendarOutlined, EnvironmentOutlined, TeamOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Event {
  event_id: number;
  title: string;
  description: string;
  type_id: number;
  venue: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registered_count: number;
}

const Events: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  // Mock data - replace with API calls
  const [events, setEvents] = useState<Event[]>([
    {
      event_id: 1,
      title: 'Tech Symposium',
      description: 'Annual technology conference',
      type_id: 1,
      venue: 'Auditorium A',
      start_time: '2023-12-15T09:00:00',
      end_time: '2023-12-15T17:00:00',
      capacity: 200,
      status: 'upcoming',
      registered_count: 150
    },
    {
      event_id: 2,
      title: 'Coding Workshop',
      description: 'Hands-on coding session',
      type_id: 2,
      venue: 'Lab 3',
      start_time: '2023-12-10T14:00:00',
      end_time: '2023-12-10T17:00:00',
      capacity: 30,
      status: 'ongoing',
      registered_count: 25
    },
  ]);

  const [eventTypes] = useState([
    { id: 1, name: 'Conference' },
    { id: 2, name: 'Workshop' },
    { id: 3, name: 'Seminar' },
    { id: 4, name: 'Hackathon' },
  ]);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchText.toLowerCase()) ||
    event.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'ongoing': return 'green';
      case 'completed': return 'default';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const handleSubmit = (values: any) => {
    const eventData = {
      ...values,
      start_time: values.dateTime[0].format('YYYY-MM-DD HH:mm:ss'),
      end_time: values.dateTime[1].format('YYYY-MM-DD HH:mm:ss'),
      registered_count: 0,
      status: 'upcoming'
    };
    
    if (editingId) {
      // Update event
      setEvents(events.map(e => e.event_id === editingId ? { ...eventData, event_id: editingId } : e));
      message.success('Event updated successfully');
    } else {
      // Add new event
      const newId = Math.max(...events.map(e => e.event_id), 0) + 1;
      setEvents([...events, { ...eventData, event_id: newId }]);
      message.success('Event created successfully');
    }
    
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.event_id !== id));
    message.success('Event deleted successfully');
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Event) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" ellipsis style={{ maxWidth: 300 }}>
            {record.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Date & Time',
      key: 'date',
      render: (_: any, record: Event) => (
        <Space direction="vertical" size={0}>
          <div><CalendarOutlined /> {dayjs(record.start_time).format('MMM D, YYYY')}</div>
          <div>
            {dayjs(record.start_time).format('h:mm A')} - {dayjs(record.end_time).format('h:mm A')}
          </div>
        </Space>
      ),
    },
    {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
      render: (venue: string) => (
        <Space>
          <EnvironmentOutlined />
          {venue}
        </Space>
      ),
    },
    {
      title: 'Capacity',
      key: 'capacity',
      render: (_: any, record: Event) => (
        <div>
          <TeamOutlined /> {record.registered_count} / {record.capacity}
          <div style={{ width: '100%', marginTop: 4 }}>
            <div 
              style={{
                height: 4,
                background: '#1890ff',
                width: `${(record.registered_count / record.capacity) * 100}%`,
                borderRadius: 2
              }} 
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Event) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingId(record.event_id);
              form.setFieldsValue({
                ...record,
                dateTime: [dayjs(record.start_time), dayjs(record.end_time)]
              });
              setIsModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.event_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={3}>Events</Title>
        <Space>
          <Input
            placeholder="Search events..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Create Event
          </Button>
        </Space>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredEvents} 
          rowKey="event_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Event' : 'Create New Event'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please input event title!' }]}
          >
            <Input placeholder="Enter event title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input event description!' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter event description" />
          </Form.Item>
          
          <Form.Item
            name="type_id"
            label="Event Type"
            rules={[{ required: true, message: 'Please select event type!' }]}
          >
            <Select placeholder="Select event type">
              {eventTypes.map(type => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="venue"
            label="Venue"
            rules={[{ required: true, message: 'Please input venue!' }]}
          >
            <Input placeholder="Enter venue" />
          </Form.Item>
          
          <Form.Item
            name="dateTime"
            label="Date & Time"
            rules={[{ required: true, message: 'Please select date and time!' }]}
          >
            <RangePicker 
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Please input capacity!' }]}
          >
            <InputNumber 
              min={1} 
              style={{ width: '100%' }} 
              placeholder="Enter maximum number of attendees"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Events;
