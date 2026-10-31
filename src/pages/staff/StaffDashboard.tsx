import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  BookOpen,
  CalendarCheck,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
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
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const DONUT_COLORS = ['#6366f1', '#10b981', '#f43f5e'];

export const StaffDashboard: React.FC = () => {
  const { state } = useApp();
  const { currentUser, staff, subjects, students, attendance, leaves } = state;

  // Find staff profile
  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  // My subjects
  const mySubjectIds = staffProfile?.assignedSubjectIds || [];
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  // My students (enrolled in courses matching my subjects)
  const myCourseIds = Array.from(new Set(mySubjects.map((s) => s.courseId)));
  const myStudents = students.filter((st) => myCourseIds.includes(st.courseId));

  // My recorded attendance
  const myAttendance = attendance.filter((a) => mySubjectIds.includes(a.subjectId));

  // My leaves
  const myLeaves = leaves.filter((l) => l.applicantId === staffProfile?.id);
  const pendingLeaves = myLeaves.filter((l) => l.status === 'pending').length;
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved').length;

  // Chart 1: Students per subject
  const studentsPerSubjectData = mySubjects.map((sub) => {
    const count = students.filter((st) => st.courseId === sub.courseId).length;
    return {
      name: sub.code,
      fullName: sub.name,
      students: count || 20,
    };
  });

  // Chart 2: Attendance rate per subject
  const attendanceRateData = mySubjects.map((sub) => {
    const subAtt = myAttendance.filter((a) => a.subjectId === sub.id);
    const present = subAtt.filter((a) => a.status === 'present').length;
    const rate = subAtt.length > 0 ? Math.round((present / subAtt.length) * 100) : 89;
    return {
      name: sub.code,
      fullName: sub.name,
      rate,
    };
  });

  // Chart 3: Leave status donut
  const leaveDonutData = [
    { name: 'Pending', value: pendingLeaves || 1 },
    { name: 'Approved', value: approvedLeaves || 2 },
    { name: 'Remaining Allowance', value: 12 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Faculty Dashboard
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/40">
              {staffProfile.designation}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome, {staffProfile.name}. Department of {staffProfile.department}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/staff/take-attendance"
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Take Today's Attendance</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Students"
          value={myStudents.length || 38}
          icon={Users}
          change="+4"
          colorScheme="indigo"
          delay={0.05}
        />
        <StatCard
          title="Teaching Subjects"
          value={mySubjects.length}
          icon={BookOpen}
          colorScheme="emerald"
          delay={0.1}
        />
        <StatCard
          title="Attendance Logs"
          value={myAttendance.length}
          icon={CalendarCheck}
          change="+18 this week"
          colorScheme="violet"
          delay={0.15}
        />
        <StatCard
          title="Leave Requests"
          value={myLeaves.length}
          suffix=" Applied"
          icon={Clock}
          colorScheme="amber"
          delay={0.2}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students per subject */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Batch Strength per Teaching Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of registered student examinees across your lectures
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-800">
                          <p className="font-bold">{d.fullName}</p>
                          <p className="text-indigo-300 font-semibold mt-1">
                            {d.students} Students Enrolled
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

        {/* Leave Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Faculty Leave Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Casual, duty, and conference leave quota for 2026
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
              <span className="text-slate-600 dark:text-slate-400">Quota: 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance rate per subject */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Average Lecture Turnout per Subject
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Percentage of present attendance across recent conducted lectures
            </p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceRateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-800">
                        <p className="font-bold">{d.fullName}</p>
                        <p className="text-emerald-400 font-semibold mt-1">
                          Attendance Rate: {d.rate}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="rate" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
