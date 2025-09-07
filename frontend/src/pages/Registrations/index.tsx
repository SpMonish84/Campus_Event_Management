import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Registrations: React.FC = () => {
  return (
    <PageTemplate 
      title="Registrations" 
      icon={<FormOutlined />}
    >
      {/* Registrations management content will go here */}
    </PageTemplate>
  );
};

export default Registrations;
