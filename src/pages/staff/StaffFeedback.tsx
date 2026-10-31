import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, ShieldCheck, Users, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackThread } from '../../types';
import { Modal } from '../../components/ui/Modal';

export const StaffFeedback: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { currentUser, feedbackThreads, staff } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const myThreads = feedbackThreads.filter((t) => t.initiatorId === staffProfile?.id);

  const [activeThreadId, setActiveThreadId] = useState<string>(myThreads[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<FeedbackThread['category']>('Curriculum');
  const [newFirstMessage, setNewFirstMessage] = useState('');

  const activeThread = feedbackThreads.find((t) => t.id === activeThreadId) || myThreads[0];

  const handleSendMessage = (e: React.FormEvent) => {
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
    showToast('success', 'Message dispatched to HOD office.');
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newFirstMessage.trim() || !currentUser) return;

    const threadId = `fb-${Date.now()}`;
    const now = new Date().toISOString();

    const thread: FeedbackThread = {
      id: threadId,
      initiatorId: staffProfile.id,
      initiatorName: staffProfile.name,
      initiatorRole: 'staff',
      subject: newSubject,
      category: newCategory,
      createdAt: now,
      updatedAt: now,
      hasUnreadAdmin: true,
      hasUnreadUser: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: 'staff',
          message: newFirstMessage,
          timestamp: now,
        },
      ],
    };

    dispatch({
      type: 'CREATE_FEEDBACK_THREAD',
      payload: thread,
    });

    setActiveThreadId(threadId);
    setNewThreadModalOpen(false);
    setNewSubject('');
    setNewFirstMessage('');
    showToast('success', 'New communication thread opened with HOD.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Faculty Grievances & HOD Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Direct institutional channel with Department Chair & Examination Committee.
          </p>
        </div>

        <button
          onClick={() => setNewThreadModalOpen(true)}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion with HOD</span>
        </button>
      </div>

      {/* Split Thread Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[580px] max-h-[75vh]">
        {/* Left: My Threads */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300">
            My Active Discussions ({myThreads.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {myThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet. Click "New Discussion with HOD" to submit feedback.
              </div>
            ) : (
              myThreads.map((thread) => {
                const isActive = thread.id === activeThread?.id;
                const lastMsg = thread.messages[thread.messages.length - 1];

                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`p-4 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {thread.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(thread.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {lastMsg?.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col overflow-hidden">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeThread.subject}
                  </h3>
                  <p className="text-xs text-slate-400">Category: {activeThread.category}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
                {activeThread.messages.map((msg) => {
                  const isMe = msg.senderRole === 'staff';

                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold mb-1 ${
                            isMe ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.senderName} ({msg.senderRole === 'admin' ? 'HOD Office' : 'You'})
                        </div>
                        <p>{msg.message}</p>
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isMe ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {msg.senderName[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type message to HOD..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select or initiate a discussion from the left pane.
            </div>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      <Modal
        isOpen={newThreadModalOpen}
        onClose={() => setNewThreadModalOpen(false)}
        title="Open Communication with HOD"
        subtitle="Submit syllabus updates, infrastructure requests, or academic notes."
      >
        <form onSubmit={handleCreateThread} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Topic / Subject *
            </label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. GPU workstation setup for deep learning lab"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            >
              <option value="Curriculum">Curriculum & Syllabus</option>
              <option value="Infrastructure">Infrastructure & Labs</option>
              <option value="Academic">Academic Schedule & Examinations</option>
              <option value="Administration">Department Administration</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message Content *
            </label>
            <textarea
              rows={4}
              required
              value={newFirstMessage}
              onChange={(e) => setNewFirstMessage(e.target.value)}
              placeholder="Describe the proposal or consultation request in detail..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setNewThreadModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
            >
              Submit Discussion
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
