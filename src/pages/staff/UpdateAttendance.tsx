import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  History,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Save,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';

export const UpdateAttendance: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { subjects, students, attendance, staff, currentUser } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const mySubjectIds = staffProfile?.assignedSubjectIds || [];
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || subjects[0]?.id || 'subj-1');
  const [selectedDate, setSelectedDate] = useState('2026-10-30');

  const targetSubject = subjects.find((s) => s.id === selectedSubject);

  // Existing records for this subject and date
  const existingRecords = useMemo(() => {
    return attendance.filter((a) => a.subjectId === selectedSubject && a.date === selectedDate);
  }, [attendance, selectedSubject, selectedDate]);

  // Candidate students
  const candidateStudents = useMemo(() => {
    if (!targetSubject) return [];
    return students.filter((st) => st.courseId === targetSubject.courseId);
  }, [students, targetSubject]);

  // Attendance state map
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent'>>({});

  React.useEffect(() => {
    const map: Record<string, 'present' | 'absent'> = {};
    candidateStudents.forEach((st) => {
      const rec = existingRecords.find((r) => r.studentId === st.id);
      map[st.id] = rec ? rec.status : 'present';
    });
    setAttendanceMap(map);
  }, [candidateStudents, existingRecords]);

  const toggleStatus = (studentId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleUpdate = () => {
    const updatedRecords: AttendanceRecord[] = candidateStudents.map((st) => {
      const existing = existingRecords.find((r) => r.studentId === st.id);
      return {
        id: existing ? existing.id : `att-${Date.now()}-${st.id}`,
        studentId: st.id,
        subjectId: selectedSubject,
        sessionId: 'sess-3',
        date: selectedDate,
        status: attendanceMap[st.id] || 'present',
        markedByStaffId: staffProfile?.id || 'staff-1',
        markedAt: new Date().toISOString(),
      };
    });

    dispatch({
      type: 'MARK_ATTENDANCE_BULK',
      payload: updatedRecords,
    });

    showToast('success', `Attendance logs for ${selectedDate} updated successfully.`, 'Records Synced');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Audit & Update Attendance Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revise past attendance rosters and rectify status records.
          </p>
        </div>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Select Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs">
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
            Record Date to Inspect & Modify
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>

      {/* Roster list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {candidateStudents.map((st) => {
            const isPresent = attendanceMap[st.id] === 'present';

            return (
              <div
                key={st.id}
                onClick={() => toggleStatus(st.id)}
                className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer select-none ${
                  isPresent
                    ? 'hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
                    : 'bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.name}</h4>
                    <p className="font-mono text-xs text-slate-400">{st.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold ${
                      isPresent
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isPresent ? 'Marked Present' : 'Marked Absent'}
                  </span>

                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      isPresent
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    Click to Toggle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
