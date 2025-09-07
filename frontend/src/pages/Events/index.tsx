import React from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Events: React.FC = () => {
  return (
    <PageTemplate 
      title="Events" 
      icon={<CalendarOutlined />}
    >
      {/* Events management content will go here */}
    </PageTemplate>
  );
};

export default Events;
