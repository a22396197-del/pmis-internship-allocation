import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentProfile } from '../pages/student/StudentProfile';
import { RecommendedInternships } from '../pages/student/RecommendedInternships';
import { MyApplications } from '../pages/student/MyApplications';

// Company Pages
import { CompanyDashboard } from '../pages/company/CompanyDashboard';
import { PostInternship } from '../pages/company/PostInternship';
import { ManageInternships } from '../pages/company/ManageInternships';
import { CandidatePool } from '../pages/company/CandidatePool';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AllocationManagement } from '../pages/admin/AllocationManagement';
import { AnalyticsView } from '../pages/admin/AnalyticsView';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<><Navbar /><LandingPage /></>} />
      <Route path="/login" element={<><Navbar /><LoginPage /></>} />
      <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/recommendations"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <RecommendedInternships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/explore"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <RecommendedInternships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/post-internship"
        element={
          <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']}>
            <PostInternship />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/internships"
        element={
          <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']}>
            <ManageInternships />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/internships/:id/candidates"
        element={
          <ProtectedRoute allowedRoles={['COMPANY', 'ADMIN']}>
            <CandidatePool />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/allocation"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AllocationManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AnalyticsView />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
