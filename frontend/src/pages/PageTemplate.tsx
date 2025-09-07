import React from 'react';
import { Card, Typography, theme } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { useToken } = theme;

interface PageTemplateProps {
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ title, children, icon }) => {
  const { token } = useToken();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 24 
      }}>
        {icon && (
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: `${token.colorPrimary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: token.colorPrimary,
            fontSize: 20
          }}>
            {icon}
          </div>
        )}
        <Title level={3} style={{ margin: 0 }}>{title}</Title>
      </div>
      
      <Card 
        style={{ 
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          minHeight: 400
        }}
        bodyStyle={{ padding: 24 }}
      >
        {children || (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: 300,
            color: token.colorTextSecondary
          }}>
            <Text style={{ fontSize: 16 }}>This is a placeholder for the {title.toLowerCase()} page.</Text>
            <Text style={{ marginTop: 8, color: token.colorTextTertiary }}>
              Content will be added here in future updates.
            </Text>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PageTemplate;
