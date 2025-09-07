import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { theme } from './theme';
import { GlobalStyles } from './styles/global';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ConfigProvider>
  </StrictMode>
);
