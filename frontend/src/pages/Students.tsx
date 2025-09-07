import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Card, Typography, Tag, message, Grid } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface Student {
  student_id: number;
  name: string;
  email: string;
  college_id: number;
  semester: number;
  status: 'active' | 'inactive';
}

const Students: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const screens = useBreakpoint();

  // Mock data - replace with API calls
  const [students, setStudents] = useState<Student[]>([
    { student_id: 1, name: 'John Doe', email: 'john@example.com', college_id: 1, semester: 5, status: 'active' },
    { student_id: 2, name: 'Jane Smith', email: 'jane@example.com', college_id: 1, semester: 6, status: 'active' },
  ]);

  const [colleges] = useState([
    { id: 1, name: 'Engineering College' },
    { id: 2, name: 'Medical College' },
  ]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = (values: Omit<Student, 'student_id'>) => {
    if (editingId) {
      // Update student
      setStudents(students.map(s => s.student_id === editingId ? { ...values, student_id: editingId } : s));
      message.success('Student updated successfully');
    } else {
      // Add new student
      const newId = Math.max(...students.map(s => s.student_id), 0) + 1;
      setStudents([...students, { ...values, student_id: newId }]);
      message.success('Student added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter(s => s.student_id !== id));
    message.success('Student deleted successfully');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      responsive: ['sm' as const],
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md' as const],
    },
    {
      title: 'College',
      dataIndex: 'college_id',
      key: 'college',
      responsive: ['lg' as const],
      render: (collegeId: number) => {
        const college = colleges.find(c => c.id === collegeId);
        return college ? college.name : 'Unknown';
      },
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      responsive: ['md' as const],
      render: (semester: number) => `Sem ${semester}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingId(record.student_id);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.student_id)}
          />
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
        <Title level={3} style={{ marginBottom: screens.xs ? '16px' : 0 }}>Students</Title>
        <Space 
          direction={screens.xs ? 'vertical' : 'horizontal'} 
          style={{ width: screens.xs ? '100%' : 'auto' }}
        >
          <Input
            placeholder="Search students..."
            prefix={<SearchOutlined />}
            style={{ width: screens.xs ? '100%' : 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            block={screens.xs}
            onClick={() => {
              form.resetFields();
              setEditingId(null);
              setIsModalVisible(true);
            }}
          >
            {screens.xs ? 'Add' : 'Add Student'}
          </Button>
        </Space>
      </div>

      <Card bodyStyle={{ padding: screens.xs ? 12 : 24 }}>
        <Table 
          columns={columns} 
          dataSource={filteredStudents} 
          rowKey="student_id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: !screens.xs,
            size: screens.xs ? 'small' : 'default'
          }}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit Student' : 'Add New Student'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={screens.xs ? '100%' : 600}
        style={{ top: screens.xs ? 0 : 20 }}
        bodyStyle={{ padding: screens.xs ? 12 : 24 }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
          >
            {editingId ? 'Update' : 'Create'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input the student\'s name!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          
          <Form.Item
            name="college_id"
            label="College"
            rules={[{ required: true, message: 'Please select a college!' }]}
          >
            <Select 
              placeholder="Select a college"
              dropdownMatchSelectWidth={200}
            >
              {colleges.map(college => (
                <Option key={college.id} value={college.id}>
                  {college.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="semester"
            label="Semester"
            rules={[{ required: true, message: 'Please input the semester!' }]}
          >
            <InputNumber 
              min={1} 
              max={12} 
              style={{ width: '100%' }} 
            />
          </Form.Item>
          
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
