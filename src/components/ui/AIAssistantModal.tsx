import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User as UserIcon, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your SIGCE AI Academic Advisor. Ask me anything about your attendance stats, semester results, course subjects, or college policies.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state } = useApp();
  const { currentUser, attendance, results, subjects, courses, students, leaves } = state;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Prepare context data to send to Gemini API
  const buildUserContext = () => {
    if (!currentUser) return {};

    if (currentUser.role === 'student') {
      const myAttendance = attendance.filter((a) => a.studentId === currentUser.id);
      const totalLectures = myAttendance.length;
      const presentLectures = myAttendance.filter((a) => a.status === 'present').length;
      const percentage = totalLectures > 0 ? ((presentLectures / totalLectures) * 100).toFixed(1) : '100';

      const myResults = results.filter((r) => r.studentId === currentUser.id);
      const myLeaves = leaves.filter((l) => l.applicantId === currentUser.id);

      return {
        role: 'student',
        name: currentUser.name,
        rollNo: currentUser.rollNo,
        semester: currentUser.semester,
        attendanceStats: {
          totalClasses: totalLectures,
          attended: presentLectures,
          percentage: `${percentage}%`,
        },
        semesterResults: myResults.map((r) => {
          const sub = subjects.find((s) => s.id === r.subjectId);
          return {
            subject: sub?.name || r.subjectId,
            code: sub?.code,
            marks: `${r.totalMarks}/100`,
            grade: r.grade,
          };
        }),
        recentLeaves: myLeaves,
      };
    }

    if (currentUser.role === 'staff') {
      const myStaff = state.staff.find((s) => s.id === currentUser.id || s.email === currentUser.email);
      const mySubjectIds = myStaff?.assignedSubjectIds || [];
      const mySubjects = subjects.filter((s) => mySubjectIds.includes(s.id));
      const myLeaves = leaves.filter((l) => l.applicantId === currentUser.id);

      return {
        role: 'staff',
        name: currentUser.name,
        department: currentUser.department,
        designation: currentUser.designation,
        allocatedSubjects: mySubjects.map((s) => ({ name: s.name, code: s.code, credits: s.credits })),
        leaves: myLeaves,
      };
    }

    // Admin context
    const totalStudents = students.length;
    const totalStaff = state.staff.length;
    const totalCourses = courses.length;
    const pendingLeaves = leaves.filter((l) => l.status === 'pending');

    return {
      role: 'admin',
      name: currentUser.name,
      designation: 'Head of Department / Administrator',
      collegeStats: {
        totalStudents,
        totalStaff,
        totalCourses,
        pendingLeavesCount: pendingLeaves.length,
      },
      pendingLeavesSummary: pendingLeaves.map((l) => ({
        applicant: l.applicantName,
        role: l.applicantRole,
        days: l.daysCount,
        reason: l.reason,
      })),
    };
  };

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          userContext: buildUserContext(),
        }),
      });

      const data = await response.json();
      const reply = data.text || 'Unable to fetch response from Gemini assistant.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'There was an issue contacting the AI assistant. Please check server connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Quick suggestion prompts based on role
  const suggestions =
    currentUser?.role === 'student'
      ? [
          'What is my overall attendance percentage?',
          'How did I perform in Data Structures?',
          'Am I eligible for campus placement drives?',
        ]
      : currentUser?.role === 'staff'
      ? [
          'Which subjects am I teaching this semester?',
          'What is the standard procedure to apply for Duty Leave?',
          'How can I update past attendance records?',
        ]
      : [
          'How many leave requests are currently pending?',
          'Which students have attendance below 75% threshold?',
          'Summarize department faculty strength and courses.',
        ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-medium shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all cursor-pointer group"
          aria-label="Toggle SIGCE AI Assistant"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-0.5 rounded-full bg-indigo-500 animate-ping opacity-25 group-hover:opacity-40" />
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide">SIGCE AI</span>
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-22 right-4 sm:right-6 z-40 w-[92vw] sm:w-[420px] h-[550px] max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    SIGCE AI Advisor
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </h4>
                  <p className="text-[11px] text-indigo-100">Powered by Gemini 3.8 Flash</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>Thinking with college database...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-slate-100/60 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="shrink-0 text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about marks, attendance, rules..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
