import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import CommunityFeed from './pages/CommunityFeed';
import LandingPage from './pages/LandingPage';
import MyReports from './pages/MyReports';
import ReportIncident from './pages/ReportIncident';
import ResidentDashboard from './pages/ResidentDashboard';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? children : <Navigate to="/app" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/app" element={<Protected><AppLayout /></Protected>}>
            <Route index element={<ResidentDashboard />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="my-reports" element={<MyReports />} />
            <Route path="feed" element={<CommunityFeed />} />
            <Route path="admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
