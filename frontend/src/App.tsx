import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Dashboard } from './components/Dashboard';
import Transactions from './pages/Transactions';
import GoalsPage from './pages/GoalsPage';
import { Budget } from './components/Budget';
import { Goals } from './components/Goals';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import Investments from './pages/Investments';
import AnalyticsPage from './pages/AnalyticsPage';
import AIChatPage from './pages/AIChatPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (!token && !context?.token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <MobileHeader isOpen={isMobileMenuOpen} onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <Sidebar isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 w-full dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const context = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const isAuthenticated = token || context?.token;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />

<Route
  path="/budget"
  element={
    <ProtectedRoute>
      <Layout>
        <Budget />    
      </Layout>
    </ProtectedRoute>
  }
/>


      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <GoalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute>
            <Layout>
              <AIChatPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="/investments" element={<Investments />} />

      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
