import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewAttendance: React.FC = () => {
  const { state } = useApp();
  const { courses, subjects, sessions, students, attendance } = state;

  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || 'course-1');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || 'subj-1');
  const [selectedSession, setSelectedSession] = useState(sessions[2]?.id || 'sess-3');
  const [selectedDate, setSelectedDate] = useState('2026-10-30');

  // Filter subjects for the selected course
  const courseSubjects = useMemo(() => {
    return subjects.filter((s) => s.courseId === selectedCourse);
  }, [subjects, selectedCourse]);

  // Students belonging to selected course & session
  const targetStudents = useMemo(() => {
    return students.filter(
      (st) => st.courseId === selectedCourse && (selectedSession === 'All' || st.sessionId === selectedSession)
    );
  }, [students, selectedCourse, selectedSession]);

  // Heatmap generation for month of October 2026 (31 days)
  const heatmapDays = useMemo(() => {
    const days = [];
    for (let day = 1; day <= 31; day++) {
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `2026-10-${dayStr}`;
      // records for this subject and date
      const recs = attendance.filter((a) => a.subjectId === selectedSubject && a.date === dateStr);
      const total = recs.length;
      const present = recs.filter((r) => r.status === 'present').length;
      const rate = total > 0 ? Math.round((present / total) * 100) : null;

      days.push({
        day,
        dateStr,
        total,
        present,
        rate,
      });
    }
    return days;
  }, [attendance, selectedSubject]);

  // Attendance for selected date
  const dateAttendanceMap = useMemo(() => {
    const map = new Map<string, 'present' | 'absent'>();
    attendance
      .filter((a) => a.subjectId === selectedSubject && a.date === selectedDate)
      .forEach((a) => {
        map.set(a.studentId, a.status);
      });
    return map;
  }, [attendance, selectedSubject, selectedDate]);

  let presentCount = 0;
  let absentCount = 0;
  targetStudents.forEach((st) => {
    const status = dateAttendanceMap.get(st.id);
    if (status === 'present') presentCount++;
    else if (status === 'absent') absentCount++;
    else {
      // If not marked, consider as default present for rich view
      presentCount++;
    }
  });

  const totalCohort = targetStudents.length || 1;
  const attendanceRate = Math.round((presentCount / totalCohort) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Student Attendance Analytics & Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed calendar heatmap, daily lecture logs, and compliance records.
        </p>
      </div>

      {/* Select Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Course Stream
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              const subs = subjects.filter((s) => s.courseId === e.target.value);
              if (subs.length > 0) setSelectedSubject(subs[0].id);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Subject Module
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            {courseSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Academic Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Cohorts</option>
            {sessions.map((sess) => (
              <option key={sess.id} value={sess.id}>
                Batch {sess.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Lecture Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>

      {/* Calendar Heatmap Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Monthly Attendance Calendar Heatmap (October 2026)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any calendar day to inspect lecture turnout and roster.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
              <span>≥ 85%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-400"></span>
              <span>70–84%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500"></span>
              <span>&lt; 70%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800"></span>
              <span>No Class</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-11 md:grid-cols-16 gap-2 pt-2">
          {heatmapDays.map((d) => {
            const isSelected = d.dateStr === selectedDate;
            let bgColor = 'bg-slate-100 dark:bg-slate-800/80 text-slate-400';

            if (d.rate !== null) {
              if (d.rate >= 85) {
                bgColor = 'bg-emerald-500 text-white font-bold';
              } else if (d.rate >= 70) {
                bgColor = 'bg-amber-400 text-amber-950 font-bold';
              } else {
                bgColor = 'bg-rose-500 text-white font-bold';
              }
            }

            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition-all cursor-pointer ${bgColor} ${
                  isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-900 scale-105 shadow-md' : 'hover:opacity-90'
                }`}
                title={`${d.dateStr}: ${d.rate !== null ? `${d.rate}% attendance` : 'No class logged'}`}
              >
                <span className="text-[10px] opacity-80">Oct</span>
                <span className="text-sm font-extrabold">{d.day}</span>
                <span className="text-[9px] mt-0.5">
                  {d.rate !== null ? `${d.rate}%` : '-'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Stats & Student Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
              <span>Attendance Roster: {selectedDate}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subjects.find((s) => s.id === selectedSubject)?.name} ({subjects.find((s) => s.id === selectedSubject)?.code})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Present: {presentCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Absent: {absentCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
              Rate: {attendanceRate}%
            </div>
          </div>
        </div>

        {/* Attendance Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Roll No</th>
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4">Email Address</th>
                <th className="py-2.5 px-4">Lecture Status</th>
                <th className="py-2.5 px-4 text-right">Log Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {targetStudents.slice(0, 15).map((st) => {
                const status = dateAttendanceMap.get(st.id) || 'present';
                const isPresent = status === 'present';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {st.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {st.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{st.email}</td>
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
                    <td className="py-3 px-4 text-right text-xs text-slate-400 font-mono">
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
