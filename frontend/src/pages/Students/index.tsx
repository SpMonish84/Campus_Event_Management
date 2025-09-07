import React from 'react';
import { TeamOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Students: React.FC = () => {
  return (
    <PageTemplate 
      title="Students" 
      icon={<TeamOutlined />}
    >
      {/* Student management content will go here */}
    </PageTemplate>
  );
};

export default Students;
