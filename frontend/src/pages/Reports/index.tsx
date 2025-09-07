import React from 'react';
import { BarChartOutlined } from '@ant-design/icons';
import PageTemplate from '../PageTemplate';

const Reports: React.FC = () => {
  return (
    <PageTemplate 
      title="Reports" 
      icon={<BarChartOutlined />}
    >
      {/* Reports content will go here */}
    </PageTemplate>
  );
};

export default Reports;
