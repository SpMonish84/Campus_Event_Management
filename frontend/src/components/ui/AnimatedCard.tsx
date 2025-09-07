import React from 'react';
import { Card, CardProps } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  
  .ant-card-head {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  .ant-card-head-title {
    font-weight: 600;
  }
`;

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode;
  hoverEffect?: boolean;
  animation?: 'fade' | 'slide' | 'scale';
  delay?: number;
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
};

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  hoverEffect = true,
  animation = 'fade',
  delay = 0,
  ...props
}) => {
  const selectedAnimation = animations[animation];
  
  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      transition={{ ...selectedAnimation.transition, delay }}
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' } : {}}
    >
      <StyledCard {...props}>
        {children}
      </StyledCard>
    </motion.div>
  );
};

export default AnimatedCard;
