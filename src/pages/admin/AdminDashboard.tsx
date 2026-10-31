import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const DONUT_COLORS = ['#6366f1', '#10b981', '#f43f5e'];

export const AdminDashboard: React.FC = () => {
  const { state } = useApp();
  const { students, staff, courses, subjects, attendance, leaves, results } = state;

  // 1. Students per course data
  const studentsPerCourseData = courses.map((c) => {
    const count = students.filter((st) => st.courseId === c.id).length;
    return {
      name: c.code,
      fullName: c.name,
      students: count,
    };
  });

  // 2. Attendance per subject data
  const subjectAttendanceData = subjects.slice(0, 6).map((sub) => {
    const subAtt = attendance.filter((a) => a.subjectId === sub.id);
    const present = subAtt.filter((a) => a.status === 'present').length;
    const absent = subAtt.filter((a) => a.status === 'absent').length;
    const rate = subAtt.length > 0 ? Math.round((present / subAtt.length) * 100) : 85;
    return {
      subject: sub.code,
      fullName: sub.name,
      present,
      absent,
      rate,
    };
  });

  // 3. Staff evaluation radar data
  const staffRadarData = [
    { metric: 'Curriculum Delivery', value: 92 },
    { metric: 'Lab Mentorship', value: 88 },
    { metric: 'Research Output', value: 81 },
    { metric: 'Student Rating', value: 95 },
    { metric: 'Timely Grading', value: 90 },
    { metric: 'Industry Collab', value: 78 },
  ];

  // 4. Leave status donut data
  const pendingLeaves = leaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = leaves.filter((l) => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter((l) => l.status === 'rejected').length;

  const leaveDonutData = [
    { name: 'Pending', value: pendingLeaves || 1 },
    { name: 'Approved', value: approvedLeaves || 4 },
    { name: 'Rejected', value: rejectedLeaves || 1 },
  ];

  // 5. Monthly attendance trend
  const monthlyTrendData = [
    { month: 'Jun', attendance: 88, target: 80 },
    { month: 'Jul', attendance: 91, target: 80 },
    { month: 'Aug', attendance: 87, target: 80 },
    { month: 'Sep', attendance: 93, target: 80 },
    { month: 'Oct', attendance: 90, target: 80 },
    { month: 'Nov (Proj)', attendance: 92, target: 80 },
  ];

  // 6. Top 5 students leaderboard based on results / marks
  const studentScores: Record<string, { total: number; count: number }> = {};
  results.forEach((r) => {
    if (!studentScores[r.studentId]) {
      studentScores[r.studentId] = { total: 0, count: 0 };
    }
    studentScores[r.studentId].total += r.totalMarks;
    studentScores[r.studentId].count += 1;
  });

  const leaderboard = Object.keys(studentScores)
    .map((studId) => {
      const st = students.find((s) => s.id === studId);
      const scoreObj = studentScores[studId];
      const avg = scoreObj.count > 0 ? (scoreObj.total / scoreObj.count).toFixed(1) : '0';
      const course = courses.find((c) => c.id === st?.courseId);
      return {
        id: studId,
        name: st?.name || 'Student',
        rollNo: st?.rollNo || '',
        avatar: st?.avatar,
        course: course?.code || 'ENGG',
        avgMarks: parseFloat(avg),
      };
    })
    .sort((a, b) => b.avgMarks - a.avgMarks)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            HOD Administration Overview
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/40">
              Live Term 2026
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time academic performance, attendance metrics, and department telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/attendance"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Attendance Log</span>
          </Link>
          <Link
            to="/admin/leaves"
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Review Leaves ({pendingLeaves})</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={GraduationCap}
          change="+12.5%"
          colorScheme="indigo"
          delay={0.05}
        />
        <StatCard
          title="Faculty Staff"
          value={staff.length}
          icon={Users}
          change="+2"
          colorScheme="emerald"
          delay={0.1}
        />
        <StatCard
          title="Active Courses"
          value={courses.length}
          icon={BookOpen}
          colorScheme="violet"
          delay={0.15}
        />
        <StatCard
          title="Allocated Subjects"
          value={subjects.length}
          icon={ClipboardList}
          change="+4"
          colorScheme="cyan"
          delay={0.2}
        />
      </div>

      {/* Charts Grid: Row 1 (Bar & Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students per Course */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Student Enrollment by Department
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribution across 6 accredited engineering branches
              </p>
            </div>
            <Link
              to="/admin/courses"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <span>Manage Courses</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerCourseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-800">
                          <p className="font-bold">{data.fullName}</p>
                          <p className="text-indigo-300 font-semibold mt-1">
                            {data.students} Enrolled Students
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="students" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Evaluation Radar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Faculty Accreditation Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department average index against NAAC benchmarks
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={staffRadarData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Staff Index" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid: Row 2 (Monthly Attendance Trend & Leave Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly College Attendance Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average across all lectures vs minimum eligibility threshold (80%)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-800">
                          <p className="font-bold">{payload[0].payload.month}</p>
                          <p className="text-emerald-400 font-semibold mt-1">
                            Attendance: {payload[0].value}%
                          </p>
                          <p className="text-slate-400">Target: 80%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#attGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Status Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Leave Applications Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of pending vs processed student/staff leaves
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveDonutData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Pending ({pendingLeaves})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Approved ({approvedLeaves})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Rejected ({rejectedLeaves})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Subject Attendance comparison & Top 5 Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject-Wise Attendance (Grouped Bar) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance Compliance by Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Present vs Absent counts from recorded sessions
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Leaderboard */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Academic Merit Board</span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Top semester achievers by aggregate exam percentage
            </p>

            <div className="space-y-3">
              {leaderboard.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                          : idx === 2
                          ? 'bg-amber-700/20 text-amber-900 dark:text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <img
                      src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={item.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.course} · {item.rollNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      {item.avgMarks}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
