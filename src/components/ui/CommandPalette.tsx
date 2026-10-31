import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { state, login } = useApp();
  const { currentUser } = state;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const role = currentUser?.role || 'admin';

  // Base navigation items according to current role
  const navigationItems = [
    { title: 'Dashboard', path: `/${role}/dashboard`, icon: Sparkles, role: 'all' },
    { title: 'Staff Directory', path: '/admin/staff', icon: Users, role: 'admin' },
    { title: 'Student Directory', path: '/admin/students', icon: GraduationCap, role: 'admin' },
    { title: 'Courses Management', path: '/admin/courses', icon: BookOpen, role: 'admin' },
    { title: 'Subject Allocations', path: '/admin/subjects', icon: BookOpen, role: 'admin' },
    { title: 'Student Attendance Tracker', path: '/admin/attendance', icon: CalendarCheck, role: 'admin' },
    { title: 'Leave Approvals', path: '/admin/leaves', icon: FileText, role: 'admin' },
    { title: 'Feedback & Grievances', path: '/admin/feedback', icon: MessageSquare, role: 'admin' },
    // Staff routes
    { title: 'Take Daily Attendance', path: '/staff/take-attendance', icon: CalendarCheck, role: 'staff' },
    { title: 'Update Attendance Records', path: '/staff/update-attendance', icon: CalendarCheck, role: 'staff' },
    { title: 'Enter Exam Marks & Results', path: '/staff/results', icon: Award, role: 'staff' },
    { title: 'Apply Faculty Leave', path: '/staff/leave', icon: FileText, role: 'staff' },
    { title: 'Contact HOD / Department', path: '/staff/feedback', icon: MessageSquare, role: 'staff' },
    // Student routes
    { title: 'View My Attendance Heatmap', path: '/student/attendance', icon: CalendarCheck, role: 'student' },
    { title: 'View Semester Results & CGPA', path: '/student/results', icon: Award, role: 'student' },
    { title: 'Apply Student Leave', path: '/student/leave', icon: FileText, role: 'student' },
    { title: 'Submit Grievance / Feedback', path: '/student/feedback', icon: MessageSquare, role: 'student' },
  ];

  const filteredNav = navigationItems.filter(
    (item) =>
      (item.role === 'all' || item.role === role) &&
      item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Search students
  const filteredStudents = state.students
    .filter(
      (st) =>
        st.name.toLowerCase().includes(query.toLowerCase()) ||
        st.rollNo.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  // Search staff
  const filteredStaff = state.staff
    .filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.department.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleSelectNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSwitchDemo = (email: string) => {
    login(email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search student, course, or navigate..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">
                Navigation
              </div>
              <div className="space-y-0.5">
                {filteredNav.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelectNav(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      <span>{item.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Student match */}
          {query.trim().length > 1 && filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">
                Students
              </div>
              <div className="space-y-0.5">
                {filteredStudents.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => {
                      if (role === 'admin') navigate('/admin/students');
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">
                        {st.name[0]}
                      </div>
                      <div>
                        <span className="font-medium">{st.name}</span>
                        <span className="text-xs text-slate-400 ml-2">({st.rollNo})</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">Sem {st.semester}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Switch Role Quick Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">
              Switch Demo Role
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSwitchDemo('admin@admin.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-slate-700 dark:text-slate-300"
              >
                HOD / Admin
              </button>
              <button
                onClick={() => handleSwitchDemo('staff@staff.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-slate-700 dark:text-slate-300"
              >
                Faculty Staff
              </button>
              <button
                onClick={() => handleSwitchDemo('student@student.com')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-slate-700 dark:text-slate-300"
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
