
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import TransactionsPage from './pages/Transactions';
import GoalsPage from './pages/Goals';
import ProfilePage from './pages/Profile';
import IndexPage from './pages/Index';
import AuthPage from './pages/Auth';
import NotFoundPage from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { GraphQLProvider } from './lib/graphql/GraphQLProvider';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <GraphQLProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <GoalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </GraphQLProvider>
    </AuthProvider>
  );
}

export default App;
