import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Save,
  CheckCheck,
  Calendar,
  BookOpen,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';

export const TakeAttendance: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { subjects, sessions, students, staff, currentUser } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const mySubjectIds = staffProfile?.assignedSubjectIds || [];
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || subjects[0]?.id || 'subj-1');
  const [selectedSession, setSelectedSession] = useState(sessions[2]?.id || 'sess-3');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const targetSubject = subjects.find((s) => s.id === selectedSubject);

  // Target students enrolled in the subject's course
  const candidateStudents = useMemo(() => {
    if (!targetSubject) return [];
    return students.filter(
      (st) => st.courseId === targetSubject.courseId && (selectedSession === 'All' || st.sessionId === selectedSession)
    );
  }, [students, targetSubject, selectedSession]);

  // Attendance status state: Map of studentId -> 'present' | 'absent'
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent'>>({});

  // Initialize all to present by default when candidateStudents change
  React.useEffect(() => {
    const initial: Record<string, 'present' | 'absent'> = {};
    candidateStudents.forEach((st) => {
      initial[st.id] = 'present';
    });
    setAttendanceState(initial);
  }, [candidateStudents]);

  const toggleStudentStatus = (studentId: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present' | 'absent'> = {};
    candidateStudents.forEach((st) => {
      updated[st.id] = 'present';
    });
    setAttendanceState(updated);
    showToast('info', 'All students marked as Present.');
  };

  const handleSaveAttendance = () => {
    if (candidateStudents.length === 0) {
      showToast('error', 'No students available in this course batch.');
      return;
    }

    const records: AttendanceRecord[] = candidateStudents.map((st) => ({
      id: `att-${Date.now()}-${st.id}`,
      studentId: st.id,
      subjectId: selectedSubject,
      sessionId: selectedSession,
      date: selectedDate,
      status: attendanceState[st.id] || 'present',
      markedByStaffId: staffProfile?.id || 'staff-1',
      markedAt: new Date().toISOString(),
    }));

    dispatch({
      type: 'MARK_ATTENDANCE_BULK',
      payload: records,
    });

    // Trigger celebratory confetti burst!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'],
    });

    const presentCount = Object.values(attendanceState).filter((s) => s === 'present').length;
    showToast(
      'success',
      `Attendance saved: ${presentCount} / ${candidateStudents.length} students marked present.`,
      'Session Recorded'
    );
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === 'present').length;
  const absentCount = candidateStudents.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Record Daily Lecture Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conduct roll-call marking with instant synchronization to college portal.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All Present</span>
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Select Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Subject Module
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            {mySubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Academic Session Batch
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            {sessions.map((sess) => (
              <option key={sess.id} value={sess.id}>
                {sess.name} {sess.isCurrent ? '(Current)' : ''}
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

      {/* Summary Chips */}
      <div className="flex items-center gap-3">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          Total: {candidateStudents.length} Students
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Present: {presentCount}</span>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
          <XCircle className="w-4 h-4" />
          <span>Absent: {absentCount}</span>
        </div>
      </div>

      {/* Students Roll Call List with Animated Toggle Switches */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {candidateStudents.map((st, idx) => {
            const isPresent = attendanceState[st.id] === 'present';

            return (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => toggleStudentStatus(st.id)}
                className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer select-none ${
                  isPresent
                    ? 'hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
                    : 'bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-6 text-center text-xs font-mono text-slate-400 font-semibold">
                    {idx + 1}
                  </span>
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.name}</h4>
                    <p className="font-mono text-xs text-slate-400">{st.rollNo}</p>
                  </div>
                </div>

                {/* Animated Switch Button */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold ${
                      isPresent
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPresent ? 'Present' : 'Absent'}
                  </span>

                  <div
                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      isPresent ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-xs ${
                        isPresent ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      {isPresent ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
