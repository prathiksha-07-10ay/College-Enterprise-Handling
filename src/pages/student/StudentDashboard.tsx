import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { state } = useApp();
  const { currentUser, students, subjects, attendance, results, leaves, courses, sessions } = state;

  const currentStudent = students.find(
    (st) => st.id === currentUser?.id || st.email === currentUser?.email
  ) || students[0];

  const studentCourse = courses.find((c) => c.id === currentStudent?.courseId);
  const studentSession = sessions.find((s) => s.id === currentStudent?.sessionId);

  // My subjects in this course
  const mySubjects = subjects.filter((s) => s.courseId === currentStudent?.courseId);

  // My attendance records
  const myAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);
  const presentCount = myAttendance.filter((a) => a.status === 'present').length;
  const totalClasses = myAttendance.length || 1;
  const overallAttendanceRate = Math.round((presentCount / totalClasses) * 100);

  // My exam results
  const myResults = results.filter((r) => r.studentId === currentStudent?.id);

  // Calculate CGPA
  let totalGradePoints = 0;
  let totalCredits = 0;
  myResults.forEach((r) => {
    totalGradePoints += r.gradePoint * r.credits;
    totalCredits += r.credits;
  });
  const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '9.15';

  // My leaves
  const myLeaves = leaves.filter((l) => l.applicantId === currentStudent?.id);
  const pendingLeaves = myLeaves.filter((l) => l.status === 'pending').length;

  // Chart 1: Attendance per subject
  const attendancePerSubjectData = mySubjects.slice(0, 5).map((sub) => {
    const subAtt = myAttendance.filter((a) => a.subjectId === sub.id);
    const pres = subAtt.filter((a) => a.status === 'present').length;
    const rate = subAtt.length > 0 ? Math.round((pres / subAtt.length) * 100) : 88;
    return {
      name: sub.code,
      fullName: sub.name,
      rate,
    };
  });

  // Chart 2: Marks per subject
  const marksPerSubjectData = mySubjects.slice(0, 5).map((sub) => {
    const res = myResults.find((r) => r.subjectId === sub.id);
    return {
      name: sub.code,
      fullName: sub.name,
      total: res ? res.totalMarks : 85,
      assignment: res ? res.assignmentMarks : 18,
      midterm: res ? res.midTermMarks : 26,
      endsem: res ? res.endSemMarks : 41,
    };
  });

  // Chart 3: Weekly attendance trend
  const trendData = [
    { week: 'Week 1', rate: 94 },
    { week: 'Week 2', rate: 90 },
    { week: 'Week 3', rate: 86 },
    { week: 'Week 4', rate: 92 },
    { week: 'Week 5', rate: 89 },
    { week: 'Week 6', rate: 93 },
  ];

  // Circular progress ring calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAttendanceRate / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-indigo-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {currentStudent.name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {currentStudent.rollNo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                {studentCourse?.name} · Semester {currentStudent.semester} ({studentSession?.name})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/results"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Transcript & CGPA</span>
            </Link>
            <Link
              to="/student/attendance"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Full Heatmap</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Ring Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Lecture Turnout
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {overallAttendanceRate}%
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Above 75% threshold</span>
            </p>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 - (overallAttendanceRate / 100) * (2 * Math.PI * 26)}
                strokeLinecap="round"
                className="text-indigo-600"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-extrabold">{overallAttendanceRate}%</span>
          </div>
        </div>

        <StatCard
          title="Current CGPA"
          value={parseFloat(cgpa)}
          suffix=" / 10"
          icon={Award}
          change="Distinction"
          colorScheme="emerald"
          delay={0.1}
        />
        <StatCard
          title="Semester Subjects"
          value={mySubjects.length}
          icon={BookOpen}
          colorScheme="violet"
          delay={0.15}
        />
        <StatCard
          title="Leave Requests"
          value={myLeaves.length}
          icon={Clock}
          change={pendingLeaves > 0 ? `${pendingLeaves} Pending` : 'All cleared'}
          isPositive={pendingLeaves === 0}
          colorScheme="amber"
          delay={0.2}
        />
      </div>

      {/* Row 1: Charts (Attendance per Subject & Marks per Subject) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance per Subject */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance Compliance by Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimum 75% required for examination hall ticket eligibility
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendancePerSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            Attendance: {d.rate}%
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

        {/* Marks per Subject */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Subject-wise Performance Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total aggregate scores out of 100 marks
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marksPerSubjectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg border border-slate-800">
                          <p className="font-bold">{d.fullName}</p>
                          <p className="text-indigo-400 font-semibold mt-1">Total: {d.total}/100</p>
                          <p className="text-slate-400 text-[11px]">Assignment: {d.assignment}/20</p>
                          <p className="text-slate-400 text-[11px]">Mid-Term: {d.midterm}/30</p>
                          <p className="text-slate-400 text-[11px]">End-Sem: {d.endsem}/50</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance Trend Over Recent Weeks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          Weekly Attendance Trend
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Tracking your active participation through semester weeks
        </p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6366f1' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
