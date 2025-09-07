import React from 'react';
import { BankOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Colleges: React.FC = () => {
  return (
    <PageTemplate 
      title="Colleges" 
      icon={<BankOutlined />}
    >
      {/* College management content will go here */}
    </PageTemplate>
  );
};

export default Colleges;
