import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation } from
'react-router-dom';
import { Loader2Icon } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Track } from './pages/Track';
import { Payment } from './pages/Payment';
import { PaymentReview } from './pages/PaymentReview';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function RequireAdmin({ children }: {children: React.ReactElement;}) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-ink-900">
        <Loader2Icon
          className="h-6 w-6 animate-spin text-gold-400"
          aria-label="Checking your session" />
        
      </div>);

  }

  if (!session) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/track/:trackingId" element={<Track />} />
          <Route path="/pay/:trackingId" element={<Payment />} />
          <Route path="/pay/:trackingId/review" element={<PaymentReview />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/packages"
            element={
            <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>);

}