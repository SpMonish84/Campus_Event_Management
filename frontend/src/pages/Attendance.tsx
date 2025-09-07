import React, { useState } from 'react';
import { Table, Button, Space, Card, Typography, Input, Select, Tag, Badge, Modal, Avatar, Grid } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface AttendanceRecord {
  attendance_id: number;
  registration_id: number;
  event_id: number;
  event_title: string;
  student_id: number;
  student_name: string;
  check_in_time: string | null;
  status: 'present' | 'absent' | 'late';
}

const Attendance: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [eventFilter, setEventFilter] = useState<number | 'all'>('all');
  const [isMarkingModalVisible, setIsMarkingModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{id: number, title: string} | null>(null);
  const screens = useBreakpoint();

  // Mock data - replace with API calls
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    {
      attendance_id: 1,
      registration_id: 1,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 101,
      student_name: 'John Doe',
      check_in_time: '2023-12-15T09:05:00',
      status: 'present'
    },
    {
      attendance_id: 2,
      registration_id: 2,
      event_id: 1,
      event_title: 'Tech Symposium',
      student_id: 102,
      student_name: 'Jane Smith',
      check_in_time: '2023-12-15T09:30:00',
      status: 'late'
    },
    {
      attendance_id: 3,
      registration_id: 3,
      event_id: 2,
      event_title: 'Coding Workshop',
      student_id: 101,
      student_name: 'John Doe',
      check_in_time: null,
      status: 'absent'
    },
  ]);

  // Mock events for filter
  const events = [
    { id: 1, title: 'Tech Symposium' },
    { id: 2, title: 'Coding Workshop' },
  ];

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = 
      record.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
      record.event_title.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesEvent = eventFilter === 'all' || record.event_id === eventFilter;
    
    return matchesSearch && matchesEvent;
  });

  const handleMarkAttendance = (event: {id: number, title: string}) => {
    setSelectedEvent(event);
    setIsMarkingModalVisible(true);
  };

  const handleStatusChange = (attendanceId: number, newStatus: 'present' | 'absent' | 'late') => {
    setAttendance(attendance.map(record => 
      record.attendance_id === attendanceId 
        ? { 
            ...record, 
            status: newStatus,
            check_in_time: newStatus === 'present' || newStatus === 'late' 
              ? new Date().toISOString() 
              : null 
          } 
        : record
    ));
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'present':
        return <Tag color="success" icon={<CheckCircleOutlined />}>Present</Tag>;
      case 'absent':
        return <Tag color="error" icon={<CloseCircleOutlined />}>Absent</Tag>;
      case 'late':
        return <Tag color="warning" icon={<CheckCircleOutlined />}>Late</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event_title',
      key: 'event',
      responsive: ['md' as const],
      render: (text: string, record: AttendanceRecord) => (
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
      render: (text: string, record: AttendanceRecord) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text>{text}</Text>
            <Text type="secondary">ID: {record.student_id}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Check-in Time',
      dataIndex: 'check_in_time',
      key: 'check_in',
      render: (time: string | null) => 
        time ? new Date(time).toLocaleString() : <Text type="secondary">Not checked in</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: AttendanceRecord) => (
        <Space size="middle">
          {getStatusTag(status)}
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            size="small"
            onChange={(value) => handleStatusChange(record.attendance_id, value)}
          >
            <Option value="present">Present</Option>
            <Option value="absent">Absent</Option>
            <Option value="late">Late</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? '8px' : '24px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: screens.xs ? 'column' : 'row',
        justifyContent: 'space-between', 
        marginBottom: 16, 
        gap: '16px',
        alignItems: screens.xs ? 'stretch' : 'center'
      }}>
        <Title level={3} style={{ marginBottom: screens.xs ? '16px' : 0 }}>Attendance Management</Title>
        <Space 
          direction={screens.xs ? 'vertical' : 'horizontal'} 
          style={{ width: screens.xs ? '100%' : 'auto' }}
        >
          <Input
            placeholder="Search attendance..."
            prefix={<SearchOutlined />}
            style={{ width: screens.xs ? '100%' : 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Filter by event"
            style={{ width: screens.xs ? '100%' : 250 }}
            value={eventFilter}
            onChange={setEventFilter}
            dropdownMatchSelectWidth={200}
          >
            <Option value="all">All Events</Option>
            {events.map(event => (
              <Option key={event.id} value={event.id}>
                {event.title}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Card bodyStyle={{ padding: screens.xs ? 12 : 24 }}>
        <Table 
          columns={columns} 
          dataSource={filteredAttendance} 
          rowKey="attendance_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Mark Attendance - ${selectedEvent?.title || ''}`}
        open={isMarkingModalVisible}
        onCancel={() => setIsMarkingModalVisible(false)}
        width={screens.xs ? '100%' : 800}
        style={{ top: screens.xs ? 0 : 20 }}
        bodyStyle={{ padding: screens.xs ? 12 : 24 }}
        footer={[
          <Button key="cancel" onClick={() => setIsMarkingModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => setIsMarkingModalVisible(false)}>
            Save Changes
          </Button>,
        ]}
      >
        <div style={{ margin: screens.xs ? '10px 0' : '20px 0' }}>
          <p>Attendance marking interface would go here.</p>
          <p>This would include a list of registered students with checkboxes or status selectors.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Attendance;
