import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Send,
  User,
  GraduationCap,
  Users,
  CheckCircle,
  Clock,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackThread } from '../../types';

export const FeedbackThreads: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { feedbackThreads, currentUser } = state;

  const [activeThreadId, setActiveThreadId] = useState<string>(feedbackThreads[0]?.id || '');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'staff'>('all');
  const [replyText, setReplyText] = useState('');

  const filteredThreads = feedbackThreads.filter((t) => {
    if (filterRole === 'all') return true;
    return t.initiatorRole === filterRole;
  });

  const activeThread = feedbackThreads.find((t) => t.id === activeThreadId) || filteredThreads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser || !activeThread) return;

    dispatch({
      type: 'ADD_FEEDBACK_MESSAGE',
      payload: {
        threadId: activeThread.id,
        sender: currentUser,
        message: replyText.trim(),
      },
    });

    setReplyText('');
    showToast('success', 'Your response has been dispatched to the candidate.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Feedback & Grievance Communication
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Two-way dialogue between faculty, scholars, and academic administration.
        </p>
      </div>

      {/* Split Communication Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px] max-h-[80vh]">
        {/* Left: Thread List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
          {/* Filter Tabs */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterRole === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All Threads
              </button>
              <button
                onClick={() => setFilterRole('student')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterRole === 'student'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setFilterRole('staff')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterRole === 'staff'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
            </div>

            <span className="text-xs font-bold text-slate-400">
              {filteredThreads.length} Discussions
            </span>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThread?.id;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          thread.initiatorRole === 'student'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                        }`}
                      >
                        {thread.initiatorRole === 'student' ? (
                          <GraduationCap className="w-3.5 h-3.5" />
                        ) : (
                          <Users className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {thread.initiatorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {thread.hasUnreadAdmin && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                      <span className="text-[10px] text-slate-400">
                        {new Date(thread.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                    {thread.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {lastMsg?.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeThread.subject}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {activeThread.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Initiated by {activeThread.initiatorName} ({activeThread.initiatorRole})
                  </p>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
                {activeThread.messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {msg.senderName[0]}
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isAdmin
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold mb-1 flex items-center gap-1.5 ${
                            isAdmin ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.senderName}</span>
                          <span>·</span>
                          <span className="capitalize">{msg.senderRole}</span>
                        </div>
                        <p>{msg.message}</p>
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isAdmin ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendReply}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type official reply as HOD / Administrator..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select a thread from the directory to review messages and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
