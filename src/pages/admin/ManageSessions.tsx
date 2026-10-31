import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Plus, Edit2, Trash2, CheckCircle, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Session } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const ManageSessions: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { sessions, students } = state;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<Session | null>(null);

  const [formData, setFormData] = useState({
    startYear: 2024,
    endYear: 2028,
    isCurrent: false,
  });

  const handleOpenAdd = () => {
    setEditingSession(null);
    setFormData({
      startYear: 2025,
      endYear: 2029,
      isCurrent: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Session) => {
    setEditingSession(s);
    setFormData({
      startYear: s.startYear,
      endYear: s.endYear,
      isCurrent: s.isCurrent,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${formData.startYear}–${formData.endYear}`;

    if (editingSession) {
      const updated: Session = {
        ...editingSession,
        name,
        ...formData,
      };
      dispatch({ type: 'UPDATE_SESSION', payload: updated });
      showToast('success', `Session ${name} updated.`);
    } else {
      const newSession: Session = {
        id: `sess-${Date.now()}`,
        name,
        ...formData,
      };
      dispatch({ type: 'ADD_SESSION', payload: newSession });
      showToast('success', `New session ${name} created.`);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmSession) return;
    dispatch({ type: 'DELETE_SESSION', payload: deleteConfirmSession.id });
    showToast('info', `Session ${deleteConfirmSession.name} deleted.`);
    setDeleteConfirmSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Academic Sessions & Cohort Batches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure graduation batch years, term periods, and active session flag.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Academic Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sessions.map((session) => {
          const cohortStudents = students.filter((st) => st.sessionId === session.id);

          return (
            <motion.div
              key={session.id}
              whileHover={{ y: -4 }}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between ${
                session.isCurrent
                  ? 'border-indigo-500/50 dark:border-indigo-500/40 ring-1 ring-indigo-500/20'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <CalendarDays className="w-5 h-5" />
                    </span>
                    {session.isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        Active Term
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(session)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmSession(session)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Session {session.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  4-Year Degree Cycle ({session.startYear} – {session.endYear})
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between my-4 text-xs">
                  <span className="text-slate-500">Enrolled Batch Size:</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    {cohortStudents.length} Students
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Created for University of Mumbai Curriculum
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSession ? 'Update Academic Session' : 'Create Academic Session'}
        subtitle="Set matriculation starting year and graduation year range."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Year
              </label>
              <input
                type="number"
                required
                value={formData.startYear}
                onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value, 10) || 2024 })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Year
              </label>
              <input
                type="number"
                required
                value={formData.endYear}
                onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value, 10) || 2028 })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-semibold">Mark this as the Current Active Session</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
            >
              {editingSession ? 'Save Session' : 'Add Session'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmSession}
        title="Delete Session Batch"
        message={`Are you sure you want to delete session ${deleteConfirmSession?.name}?`}
        confirmLabel="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmSession(null)}
      />
    </div>
  );
};
