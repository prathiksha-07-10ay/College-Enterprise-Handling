import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Award,
  Save,
  CheckCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExamResult } from '../../types';

export const AddResult: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { subjects, students, results, staff, currentUser } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const mySubjectIds = staffProfile?.assignedSubjectIds || [];
  const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));

  const [selectedSubject, setSelectedSubject] = useState(mySubjects[0]?.id || subjects[0]?.id || 'subj-1');

  const targetSubject = subjects.find((s) => s.id === selectedSubject);

  const candidateStudents = useMemo(() => {
    if (!targetSubject) return [];
    return students.filter((st) => st.courseId === targetSubject.courseId);
  }, [students, targetSubject]);

  const [selectedStudentId, setSelectedStudentId] = useState(candidateStudents[0]?.id || 'stud-1');

  // Update selectedStudentId when candidateStudents change
  React.useEffect(() => {
    if (candidateStudents.length > 0 && !candidateStudents.some((s) => s.id === selectedStudentId)) {
      setSelectedStudentId(candidateStudents[0].id);
    }
  }, [candidateStudents, selectedStudentId]);

  // Marks inputs
  const [assignmentMarks, setAssignmentMarks] = useState(18); // max 20
  const [midTermMarks, setMidTermMarks] = useState(26);       // max 30
  const [endSemMarks, setEndSemMarks] = useState(44);         // max 50

  // Existing result if already entered
  React.useEffect(() => {
    const existing = results.find(
      (r) => r.studentId === selectedStudentId && r.subjectId === selectedSubject
    );
    if (existing) {
      setAssignmentMarks(existing.assignmentMarks);
      setMidTermMarks(existing.midTermMarks);
      setEndSemMarks(existing.endSemMarks);
    } else {
      setAssignmentMarks(17);
      setMidTermMarks(24);
      setEndSemMarks(42);
    }
  }, [selectedStudentId, selectedSubject, results]);

  // Auto-calculated total and grade
  const totalMarks = Math.min(100, Math.max(0, assignmentMarks + midTermMarks + endSemMarks));

  let grade: ExamResult['grade'] = 'F';
  let gradePoint = 0;

  if (totalMarks >= 85) {
    grade = 'O';
    gradePoint = 10;
  } else if (totalMarks >= 75) {
    grade = 'A+';
    gradePoint = 9;
  } else if (totalMarks >= 65) {
    grade = 'A';
    gradePoint = 8;
  } else if (totalMarks >= 55) {
    grade = 'B+';
    gradePoint = 7;
  } else if (totalMarks >= 50) {
    grade = 'B';
    gradePoint = 6;
  } else if (totalMarks >= 40) {
    grade = 'C';
    gradePoint = 5;
  } else {
    grade = 'F';
    gradePoint = 0;
  }

  // Circular progress ring calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalMarks / 100) * circumference;

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedSubject) {
      showToast('error', 'Please select student and subject.');
      return;
    }

    const st = students.find((s) => s.id === selectedStudentId);

    const newResult: ExamResult = {
      id: `res-${selectedStudentId}-${selectedSubject}`,
      studentId: selectedStudentId,
      subjectId: selectedSubject,
      semester: targetSubject?.semester || 4,
      assignmentMarks,
      midTermMarks,
      endSemMarks,
      totalMarks,
      grade,
      gradePoint,
      credits: targetSubject?.credits || 4,
      publishedDate: new Date().toISOString().split('T')[0],
    };

    dispatch({
      type: 'SAVE_RESULT',
      payload: newResult,
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#6366f1', '#10b981', '#f59e0b'],
    });

    showToast('success', `Grade record for ${st?.name} (${grade} - ${totalMarks}/100) published.`, 'Result Saved');
  };

  // Recent results in this subject
  const subjectResults = results.filter((r) => r.subjectId === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Examination Marks & Grade Formulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compute internal assessments, mid-term examinations, and final semester transcripts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Select & Enter Marks */}
        <form onSubmit={handleSaveResult} className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Module
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-300 outline-none"
              >
                {mySubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Candidate Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-300 outline-none"
              >
                {candidateStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.rollNo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mark inputs */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Internal Continuous Assessment (Assignments & Labs)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{assignmentMarks} / 20</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={assignmentMarks}
                onChange={(e) => setAssignmentMarks(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Mid-Term Examination Test</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{midTermMarks} / 30</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={midTermMarks}
                onChange={(e) => setMidTermMarks(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>End-Semester Final Theory / Practical Examination</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{endSemMarks} / 50</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={endSemMarks}
                onChange={(e) => setEndSemMarks(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Record Grade & Publish Result</span>
            </button>
          </div>
        </form>

        {/* Right Card: Animated Progress Ring & Grade Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">
            Real-time Evaluation Metric
          </h3>

          {/* Animated SVG Ring */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                strokeLinecap="round"
                className="text-indigo-600 dark:text-indigo-500"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalMarks}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Total / 100</span>
            </div>
          </div>

          {/* Grade Badge */}
          <div className="w-full grid grid-cols-2 gap-3 text-xs mb-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Awarded Grade</span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                Grade {grade}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Grade Points</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                {gradePoint} / 10
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Standard CGPA grading scheme under University of Mumbai ordinances.
          </p>
        </div>
      </div>

      {/* Previously Published Results in this subject */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Recorded Marks Registry for {targetSubject?.name}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Internal (20)</th>
                <th className="py-2.5 px-4">Mid-Term (30)</th>
                <th className="py-2.5 px-4">End-Sem (50)</th>
                <th className="py-2.5 px-4">Aggregate (100)</th>
                <th className="py-2.5 px-4">Grade</th>
                <th className="py-2.5 px-4 text-right">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectResults.map((r) => {
                const st = students.find((s) => s.id === r.studentId);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {st?.name || r.studentId}
                    </td>
                    <td className="py-3 px-4">{r.assignmentMarks}</td>
                    <td className="py-3 px-4">{r.midTermMarks}</td>
                    <td className="py-3 px-4">{r.endSemMarks}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {r.totalMarks}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-400">
                      {r.publishedDate}
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
