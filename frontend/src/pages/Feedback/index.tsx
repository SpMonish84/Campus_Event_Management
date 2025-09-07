import React from 'react';
import { MessageOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Feedback: React.FC = () => {
  return (
    <PageTemplate 
      title="Feedback" 
      icon={<MessageOutlined />}
    >
      {/* Feedback management content will go here */}
    </PageTemplate>
  );
};

export default Feedback;
