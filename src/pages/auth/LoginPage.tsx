import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin@erp');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [selectedRoleChip, setSelectedRoleChip] = useState<'admin' | 'staff' | 'student'>('admin');
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  const { login } = useApp();
  const navigate = useNavigate();

  const handleRoleQuickSelect = (role: 'admin' | 'staff' | 'student') => {
    setSelectedRoleChip(role);
    if (role === 'admin') {
      setEmail('admin@admin.com');
      setPassword('admin@erp');
    } else if (role === 'staff') {
      setEmail('staff@staff.com');
      setPassword('staff@erp');
    } else {
      setEmail('student@student.com');
      setPassword('student@erp');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login(email);
      setLoading(false);

      if (success) {
        // Trigger welcome screen animation
        const name =
          email.includes('admin') ? 'Dr. Suresh Patil (HOD)' :
          email.includes('staff') ? 'Dr. Rajesh Sharma' : 'Aarav Patel';

        setWelcomeUser(name);

        setTimeout(() => {
          if (email.includes('admin')) {
            navigate('/admin/dashboard');
          } else if (email.includes('staff')) {
            navigate('/staff/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }, 1200);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {welcomeUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50 mb-6"
            >
              <ShieldCheck className="w-10 h-10 text-amber-300" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              Welcome back, {welcomeUser}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-slate-400 text-sm mt-2 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronizing SIGCE ERP workspace...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Animated Gradient Mesh & Floating 3D-Style Glass Cards */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden flex-col justify-between p-12">
        {/* Animated glowing mesh blobs */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.15, 1.05, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-20 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 left-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Brand header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">SIGCE ERP</h1>
            <p className="text-xs text-indigo-300 font-medium">Smt. Indira Gandhi College of Engineering</p>
          </div>
        </div>

        {/* Center: Drifting Floating 3D-Style Glass Cards */}
        <div className="relative z-10 py-12 flex flex-col items-center justify-center">
          {/* Card 1: Graduation cap / Academics */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [-1, 2, -1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl mb-4 self-start transform -rotate-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Accredited Academic Portal</p>
                <p className="text-[11px] text-slate-300">NAAC Grade A+ · AICTE Approved</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Attendance & Analytics */}
          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [1, -2, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl mb-4 self-end transform rotate-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Live Attendance Heatmap</p>
                  <p className="text-[11px] text-slate-300">Real-time subject calculations</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-400">92.4%</span>
            </div>
          </motion.div>

          {/* Card 3: Subjects & Curriculum */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-2, 1, -2],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="w-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl self-center transform -rotate-1"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Curriculum Management</p>
                <p className="text-[11px] text-slate-300">6 Engineering Departments</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom quotes */}
        <div className="relative z-10 text-xs text-slate-400">
          <p className="text-slate-300 font-medium">Enterprise Academic Suite · Navi Mumbai</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Empowering students, faculty, and departments since 1993.</p>
        </div>
      </div>

      {/* Right Column: Glassmorphism Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-900/90 backdrop-blur-lg">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center sm:text-left mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <span className="text-xl font-extrabold text-white">SIGCE ERP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign In to Portal
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Select your role or enter institutional credentials to access your dashboard.
            </p>
          </div>

          {/* Quick Select Role Chips */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Quick Role Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('admin')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedRoleChip === 'admin'
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-rose-400" />
                <span>Admin (HOD)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('staff')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedRoleChip === 'staff'
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1 text-indigo-400" />
                <span>Faculty Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('student')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  selectedRoleChip === 'student'
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/20'
                    : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1 text-emerald-400" />
                <span>Student</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <motion.form
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Email field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Institutional Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. admin@admin.com"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Demo credentials helper */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                />
                <span>Remember me</span>
              </label>

              <span className="text-slate-500">Demo password: *</span>
            </div>

            {/* Submit button with ripple and spinner */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Quick Demo Credential Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2.5 font-medium">Instant One-Click Demo Logins</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('admin')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('staff')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Fill Staff
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('student')}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
              >
                Fill Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
