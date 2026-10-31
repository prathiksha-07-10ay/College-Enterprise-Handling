import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewStudentAttendance: React.FC = () => {
  const { state } = useApp();
  const { currentUser, students, subjects, attendance } = state;

  const currentStudent = students.find(
    (st) => st.id === currentUser?.id || st.email === currentUser?.email
  ) || students[0];

  const mySubjects = subjects.filter((s) => s.courseId === currentStudent?.courseId);

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  // Filter attendance for this student
  const filteredRecords = useMemo(() => {
    return attendance.filter((a) => {
      const matchStudent = a.studentId === currentStudent?.id;
      const matchSubject = selectedSubject === 'All' || a.subjectId === selectedSubject;
      const matchDate = a.date.startsWith(selectedMonth);
      return matchStudent && matchSubject && matchDate;
    });
  }, [attendance, currentStudent, selectedSubject, selectedMonth]);

  const presentCount = filteredRecords.filter((r) => r.status === 'present').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'absent').length;
  const totalLogs = filteredRecords.length || 1;
  const rate = Math.round((presentCount / totalLogs) * 100);

  // October 2026 calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `2026-10-${dayStr}`;

      const recs = filteredRecords.filter((r) => r.date === dateStr);
      const isPresent = recs.some((r) => r.status === 'present');
      const isAbsent = recs.some((r) => r.status === 'absent');

      days.push({
        day,
        dateStr,
        hasRecord: recs.length > 0,
        status: isPresent ? 'present' : isAbsent ? 'absent' : 'none',
      });
    }
    return days;
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          My Academic Attendance Calendar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed lecture turnout logs, calendar heatmap, and subject-wise compliance statistics.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Filter by Subject Module
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Course Subjects Combined</option>
            {mySubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Academic Calendar Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lecture Attendance Rate
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{rate}%</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Classes Attended (Present)
            </span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {presentCount} Lectures
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Missed Lectures (Absent)
            </span>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {absentCount} Lectures
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Attendance Heatmap for October 2026</span>
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500"></span>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800"></span>
              <span>No Class</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-11 md:grid-cols-16 gap-2 pt-2">
          {calendarDays.map((d) => {
            let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
            if (d.status === 'present') bg = 'bg-emerald-500 text-white font-bold shadow-xs';
            else if (d.status === 'absent') bg = 'bg-rose-500 text-white font-bold shadow-xs';

            return (
              <div
                key={d.dateStr}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs ${bg}`}
              >
                <span className="text-[10px] opacity-75">Oct</span>
                <span className="text-sm font-extrabold">{d.day}</span>
                <span className="text-[9px] mt-0.5 capitalize">
                  {d.status === 'present' ? 'Present' : d.status === 'absent' ? 'Absent' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Detailed Lecture Turnout History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Subject Code</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Verification Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.slice(0, 15).map((rec) => {
                const sub = subjects.find((s) => s.id === rec.subjectId);
                const isPresent = rec.status === 'present';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {rec.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {sub?.name || rec.subjectId}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                      {sub?.code}
                    </td>
                    <td className="py-3 px-4">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-400">
                      09:30 AM
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
