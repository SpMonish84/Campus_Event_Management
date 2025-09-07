import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#6366f1',
    colorInfo: '#6366f1',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorLink: '#6366f1',
    colorTextBase: '#1f2937',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#1e293b',
      triggerBg: '#1e293b',
      triggerColor: '#94a3b8',
    },
    Menu: {
      darkItemBg: '#1e293b',
      darkItemColor: '#94a3b8',
      darkItemSelectedBg: '#334155',
      darkItemSelectedColor: '#ffffff',
      darkItemHoverColor: '#ffffff',
      itemBorderRadius: 8,
      itemMarginBlock: 4,
      itemMarginInline: 8,
    },
    Button: {
      controlHeight: 40,
      borderRadius: 8,
      defaultShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
      primaryShadow: '0 2px 0 rgba(99, 102, 241, 0.1)',
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      colorBgContainer: '#ffffff',
      paddingLG: 24,
    },
    Input: {
      controlHeight: 42,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#fafafa',
      headerBorderRadius: 12,
    },
  },
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
};
