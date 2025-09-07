import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Attendance: React.FC = () => {
  return (
    <PageTemplate 
      title="Attendance" 
      icon={<CheckCircleOutlined />}
    >
      {/* Attendance management content will go here */}
    </PageTemplate>
  );
};

export default Attendance;
