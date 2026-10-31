import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  RotateCw,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ViewStudentResult: React.FC = () => {
  const { state } = useApp();
  const { currentUser, students, subjects, results, courses, sessions } = state;

  const currentStudent = students.find(
    (st) => st.id === currentUser?.id || st.email === currentUser?.email
  ) || students[0];

  const course = courses.find((c) => c.id === currentStudent?.courseId);
  const session = sessions.find((s) => s.id === currentStudent?.sessionId);

  const myResults = results.filter((r) => r.studentId === currentStudent?.id);

  // Flip state for result cards
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate CGPA
  let totalGradePoints = 0;
  let totalCredits = 0;
  myResults.forEach((r) => {
    totalGradePoints += r.gradePoint * r.credits;
    totalCredits += r.credits;
  });
  const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '9.15';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Academic Grade Report & Transcripts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any result card to flip and review internal vs end-semester mark components.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Result</span>
        </button>
      </div>

      {/* CGPA Summary Banner (hidden in print) */}
      <div className="no-print bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Cumulative Grade Point Average (CGPA)</h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Semester {currentStudent.semester} Evaluation · University of Mumbai Credit System
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-center sm:justify-end gap-1">
            <span>{cgpa}</span>
            <span className="text-xs text-indigo-300 font-semibold uppercase">/ 10.0</span>
          </div>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            First Class with Distinction
          </span>
        </div>
      </div>

      {/* Result Cards with Flip Animation (hidden in print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myResults.map((res) => {
          const sub = subjects.find((s) => s.id === res.subjectId);
          const isFlipped = !!flippedCards[res.id];

          return (
            <div
              key={res.id}
              onClick={() => toggleFlip(res.id)}
              className="h-64 cursor-pointer perspective-1000 select-none"
            >
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-full transform-style-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {sub?.code}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-500">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Flip details</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                      {sub?.name}
                    </h3>
                    <p className="text-xs text-slate-400">Credits: {res.credits}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Aggregate Score
                      </span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {res.totalMarks} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Grade
                      </span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {res.grade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back Side (Score Breakdown) */}
                <div
                  className="absolute inset-0 backface-hidden bg-slate-900 text-white border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-300">{sub?.code} Breakdown</span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs mt-3">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Internal Continuous (Assignments):</span>
                        <span className="font-bold text-slate-100">{res.assignmentMarks} / 20</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Mid-Term Examination:</span>
                        <span className="font-bold text-slate-100">{res.midTermMarks} / 30</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">End-Sem Examination:</span>
                        <span className="font-bold text-slate-100">{res.endSemMarks} / 50</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-indigo-300 font-semibold">Grade Points:</span>
                        <span className="font-bold text-emerald-400">{res.gradePoint} / 10</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    Official Grade Published on {res.publishedDate}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Printable Result Document (Shown on screen as a clean preview and printed cleanly via @media print) */}
      <div id="printable-result" className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6">
        {/* Institutional Letterhead */}
        <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
          <h2 className="text-xl font-extrabold uppercase tracking-wide">
            Smt. Indira Gandhi College of Engineering
          </h2>
          <p className="text-xs text-slate-600">
            Sector 16, Koparkhairane, Navi Mumbai, Maharashtra 400709
          </p>
          <p className="text-xs font-semibold text-slate-800">
            Affiliated to University of Mumbai · NAAC Accredited 'A+' Grade
          </p>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-100 text-xs font-bold tracking-wider uppercase border border-slate-300 rounded">
            Official Semester Grade Sheet / Transcript
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p><span className="font-bold">Student Name:</span> {currentStudent.name}</p>
            <p className="mt-1"><span className="font-bold">Roll Number:</span> {currentStudent.rollNo}</p>
            <p className="mt-1"><span className="font-bold">Academic Session:</span> {session?.name}</p>
          </div>
          <div>
            <p><span className="font-bold">Degree Program:</span> {course?.name}</p>
            <p className="mt-1"><span className="font-bold">Semester / Term:</span> Semester {currentStudent.semester}</p>
            <p className="mt-1"><span className="font-bold">Date of Issue:</span> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Grades Table */}
        <table className="w-full text-left border-collapse text-xs border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 font-bold">
              <th className="p-2 border-r border-slate-300">Subject Code</th>
              <th className="p-2 border-r border-slate-300">Course Title</th>
              <th className="p-2 border-r border-slate-300 text-center">Credits</th>
              <th className="p-2 border-r border-slate-300 text-center">IA (20)</th>
              <th className="p-2 border-r border-slate-300 text-center">MT (30)</th>
              <th className="p-2 border-r border-slate-300 text-center">ES (50)</th>
              <th className="p-2 border-r border-slate-300 text-center">Total (100)</th>
              <th className="p-2 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {myResults.map((r) => {
              const sub = subjects.find((s) => s.id === r.subjectId);
              return (
                <tr key={r.id} className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 font-mono font-semibold">{sub?.code}</td>
                  <td className="p-2 border-r border-slate-200">{sub?.name}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{r.credits}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{r.assignmentMarks}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{r.midTermMarks}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{r.endSemMarks}</td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold">{r.totalMarks}</td>
                  <td className="p-2 text-center font-bold">{r.grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* CGPA Summary & Signatures */}
        <div className="pt-4 flex items-end justify-between text-xs">
          <div>
            <p className="font-bold text-sm">Overall Semester CGPA: {cgpa} / 10.0</p>
            <p className="text-slate-600 mt-0.5">Classification: First Class with Distinction</p>
          </div>

          <div className="text-right space-y-8">
            <div className="text-slate-400">_____________________________</div>
            <p className="font-bold text-slate-800">Controller of Examinations (SIGCE)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
