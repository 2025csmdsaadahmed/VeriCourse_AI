import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { CourseDiscoveryPage } from './pages/CourseDiscoveryPage';
import { CourseSubmissionPage } from './pages/CourseSubmissionPage';
import { CourseReportPage } from './pages/CourseReportPage';
import { CourseComparisonPage } from './pages/CourseComparisonPage';
import { StudentExperiencesPage } from './pages/StudentExperiencesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Protected Route Component with redirect intention memory
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-forest-800 text-sm font-medium bg-warm-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-forest-800 border-t-transparent rounded-full animate-spin" />
          <span>Verifying authentication session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Remember intended destination URL to seamlessly redirect after login
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-warm-bg text-warm-charcoal">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/course/:id" element={<CourseReportPage />} />

              {/* Authenticated Pages / Actions */}
              <Route
                path="/discover"
                element={
                  <ProtectedRoute>
                    <CourseDiscoveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify"
                element={
                  <ProtectedRoute>
                    <CourseSubmissionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <CourseComparisonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/experiences"
                element={
                  <ProtectedRoute>
                    <StudentExperiencesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
