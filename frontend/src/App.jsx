import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages & Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Recognition from './pages/Recognition';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceHistory from './pages/AttendanceHistory';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="recognition" element={<Recognition />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="history" element={<AttendanceHistory />} />
          </Route>
        </Routes>
        
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000} 
          theme="dark"
          toastStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.8)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            fontSize: '14px',
            fontWeight: '600',
            color: '#f1f5f9'
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
