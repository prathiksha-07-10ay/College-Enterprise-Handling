import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CalendarCheck,
  Award,
  FileText,
  MessageSquare,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { state } = useApp();
  const { currentUser, leaves, feedbackThreads } = state;
  const location = useLocation();

  const role = currentUser?.role || 'admin';

  // Badge calculations
  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;
  const unreadFeedbackCount = feedbackThreads.filter((t) =>
    role === 'admin' ? t.hasUnreadAdmin : t.hasUnreadUser
  ).length;

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Staff', path: '/admin/staff', icon: Users },
    { name: 'Manage Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Manage Subjects', path: '/admin/subjects', icon: ClipboardList },
    { name: 'Manage Sessions', path: '/admin/sessions', icon: CalendarDays },
    { name: 'Student Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { name: 'Feedback Threads', path: '/admin/feedback', icon: MessageSquare, badge: unreadFeedbackCount },
    { name: 'Leave Approvals', path: '/admin/leaves', icon: FileText, badge: pendingLeavesCount },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
  ];

  const staffNav = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'Take Attendance', path: '/staff/take-attendance', icon: CalendarCheck },
    { name: 'Update Attendance', path: '/staff/update-attendance', icon: History },
    { name: 'Add/Update Result', path: '/staff/results', icon: Award },
    { name: 'Apply Leave', path: '/staff/leave', icon: FileText },
    { name: 'Feedback to HOD', path: '/staff/feedback', icon: MessageSquare, badge: unreadFeedbackCount },
    { name: 'Faculty Profile', path: '/staff/profile', icon: User },
  ];

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Attendance', path: '/student/attendance', icon: CalendarCheck },
    { name: 'My Results', path: '/student/results', icon: Award },
    { name: 'Apply Leave', path: '/student/leave', icon: FileText },
    { name: 'Feedback to HOD', path: '/student/feedback', icon: MessageSquare, badge: unreadFeedbackCount },
    { name: 'Student Profile', path: '/student/profile', icon: User },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'staff' ? staffNav : studentNav;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo / Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white block">
                  SIGCE ERP
                </span>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block -mt-1 uppercase tracking-wider">
                  Campus Cloud
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {role === 'admin' ? 'Administration' : role === 'staff' ? 'Faculty Portal' : 'Student Portal'}
            </div>
          )}

          {currentNav.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl -z-10 border border-indigo-200/50 dark:border-indigo-800/40"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />

                {!isCollapsed && <span className="truncate">{item.name}</span>}

                {/* Badge if any */}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Mini Banner */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                  {currentUser?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
