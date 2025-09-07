import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface College {
  college_id: number;
  name: string;
  location: string;
  status: string;
}

const Colleges: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch colleges from API
  useEffect(() => {
    // Replace with actual API call
    const fetchColleges = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockData: College[] = [
          { college_id: 1, name: 'Engineering College', location: 'Campus A', status: 'active' },
          { college_id: 2, name: 'Medical College', location: 'Campus B', status: 'active' },
        ];
        setColleges(mockData);
      } catch (error) {
        message.error('Failed to fetch colleges');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSubmit = async (values: Omit<College, 'college_id'>) => {
    try {
      if (editingId) {
        // Update existing college
        // await updateCollege(editingId, values);
        message.success('College updated successfully');
      } else {
        // Add new college
        // await addCollege(values);
        message.success('College added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      // Refresh the list
      // fetchColleges();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // await deleteCollege(id);
      message.success('College deleted successfully');
      // Refresh the list
      // fetchColleges();
    } catch (error) {
      message.error('Failed to delete college');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: College) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => {
              setEditingId(record.college_id);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.college_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Colleges</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add College
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={colleges} 
          rowKey="college_id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? 'Edit College' : 'Add New College'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="College Name"
            rules={[{ required: true, message: 'Please input the college name!' }]}
          >
            <Input placeholder="Enter college name" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please input the location!' }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
          >
            <Input placeholder="Enter status" disabled={!editingId} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Colleges;
