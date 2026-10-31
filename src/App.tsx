import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStaff } from './pages/admin/ManageStaff';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManageCourses } from './pages/admin/ManageCourses';
import { ManageSubjects } from './pages/admin/ManageSubjects';
import { ManageSessions } from './pages/admin/ManageSessions';
import { ViewAttendance } from './pages/admin/ViewAttendance';
import { FeedbackThreads } from './pages/admin/FeedbackThreads';
import { LeaveApprovals } from './pages/admin/LeaveApprovals';
import { AdminProfile } from './pages/admin/AdminProfile';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { TakeAttendance } from './pages/staff/TakeAttendance';
import { UpdateAttendance } from './pages/staff/UpdateAttendance';
import { AddResult } from './pages/staff/AddResult';
import { StaffLeave } from './pages/staff/StaffLeave';
import { StaffFeedback } from './pages/staff/StaffFeedback';
import { StaffProfile } from './pages/staff/StaffProfile';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ViewStudentAttendance } from './pages/student/ViewStudentAttendance';
import { ViewStudentResult } from './pages/student/ViewStudentResult';
import { StudentLeave } from './pages/student/StudentLeave';
import { StudentFeedback } from './pages/student/StudentFeedback';
import { StudentProfile } from './pages/student/StudentProfile';

const RootRedirect: React.FC = () => {
  const { state } = useApp();
  if (!state.currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={`/${state.currentUser.role}/dashboard`} replace />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected App Layout */}
          <Route element={<AppLayout />}>
            {/* Admin (HOD) Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ManageStaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ManageStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subjects"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ManageSubjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sessions"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ManageSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute allowedRole="admin">
                  <ViewAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute allowedRole="admin">
                  <FeedbackThreads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leaves"
              element={
                <ProtectedRoute allowedRole="admin">
                  <LeaveApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminProfile />
                </ProtectedRoute>
              }
            />

            {/* Staff Faculty Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRole="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/take-attendance"
              element={
                <ProtectedRoute allowedRole="staff">
                  <TakeAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/update-attendance"
              element={
                <ProtectedRoute allowedRole="staff">
                  <UpdateAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/results"
              element={
                <ProtectedRoute allowedRole="staff">
                  <AddResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/leave"
              element={
                <ProtectedRoute allowedRole="staff">
                  <StaffLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/feedback"
              element={
                <ProtectedRoute allowedRole="staff">
                  <StaffFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/profile"
              element={
                <ProtectedRoute allowedRole="staff">
                  <StaffProfile />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute allowedRole="student">
                  <ViewStudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRole="student">
                  <ViewStudentResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/leave"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/feedback"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
