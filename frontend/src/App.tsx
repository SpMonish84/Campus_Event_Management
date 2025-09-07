import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import CampusEventsLayout from './components/Layout/CampusEventsLayout';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Colleges = React.lazy(() => import('./pages/Colleges'));
const Students = React.lazy(() => import('./pages/Students'));
const Events = React.lazy(() => import('./pages/Events'));
const Registrations = React.lazy(() => import('./pages/Registrations'));
const Attendance = React.lazy(() => import('./pages/Attendance'));
const Feedback = React.lazy(() => import('./pages/Feedback'));
const Reports = React.lazy(() => import('./pages/Reports'));

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" />
  </div>
);

// Wrapper component for routes with layout
const RouteWithLayout = ({ children }: { children: React.ReactNode }) => (
  <CampusEventsLayout>
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  </CampusEventsLayout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={
          <RouteWithLayout>
            <Dashboard />
          </RouteWithLayout>
        } />
        
        <Route path="/colleges" element={
          <RouteWithLayout>
            <Colleges />
          </RouteWithLayout>
        } />
        
        <Route path="/students" element={
          <RouteWithLayout>
            <Students />
          </RouteWithLayout>
        } />
        
        <Route path="/events" element={
          <RouteWithLayout>
            <Events />
          </RouteWithLayout>
        } />
        
        <Route path="/registrations" element={
          <RouteWithLayout>
            <Registrations />
          </RouteWithLayout>
        } />
        
        <Route path="/attendance" element={
          <RouteWithLayout>
            <Attendance />
          </RouteWithLayout>
        } />
        
        <Route path="/feedback" element={
          <RouteWithLayout>
            <Feedback />
          </RouteWithLayout>
        } />
        
        <Route path="/reports" element={
          <RouteWithLayout>
            <Reports />
          </RouteWithLayout>
        } />
        
        {/* 404 - Not Found */}
        <Route path="*" element={
          <RouteWithLayout>
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h1>404</h1>
              <p>Page not found</p>
            </div>
          </RouteWithLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
