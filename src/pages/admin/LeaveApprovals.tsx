import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  GraduationCap,
  Users,
  Filter,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';

export const LeaveApprovals: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { leaves } = state;

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'student' | 'staff'>('pending');
  const [remarksModalLeave, setRemarksModalLeave] = useState<LeaveRequest | null>(null);
  const [decisionAction, setDecisionAction] = useState<'approved' | 'rejected'>('approved');
  const [remarks, setRemarks] = useState('');

  const filteredLeaves = leaves.filter((l) => {
    if (activeTab === 'pending') return l.status === 'pending';
    if (activeTab === 'student') return l.applicantType === 'student';
    if (activeTab === 'staff') return l.applicantType === 'staff';
    return true;
  });

  const handleOpenDecisionModal = (leave: LeaveRequest, action: 'approved' | 'rejected') => {
    setRemarksModalLeave(leave);
    setDecisionAction(action);
    setRemarks(
      action === 'approved'
        ? 'Approved. Ensure lab assignments are submitted promptly.'
        : 'Application rejected due to insufficient attendance percentage.'
    );
  };

  const handleConfirmDecision = () => {
    if (!remarksModalLeave) return;

    dispatch({
      type: 'REVIEW_LEAVE',
      payload: {
        id: remarksModalLeave.id,
        status: decisionAction,
        remarks,
      },
    });

    showToast(
      decisionAction === 'approved' ? 'success' : 'info',
      `Leave application for ${remarksModalLeave.applicantName} was marked ${decisionAction}.`
    );

    setRemarksModalLeave(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Leave Approvals & Sanctions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review absence petitions from faculty and scholars with institutional audit logs.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending Action
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scholars
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Faculty
          </button>
        </div>
      </div>

      {/* Leave Requests Grid */}
      {filteredLeaves.length === 0 ? (
        <EmptyState
          title="No pending leave applications"
          description="All submitted student and staff leave requests have been adjudicated."
          actionLabel="Show All Requests"
          onAction={() => setActiveTab('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredLeaves.map((leave) => {
              const isPending = leave.status === 'pending';
              const isApproved = leave.status === 'approved';

              return (
                <motion.div
                  key={leave.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isPending
                      ? 'border-indigo-300 dark:border-indigo-800/60'
                      : 'border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-xl ${
                            leave.applicantType === 'student'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          }`}
                        >
                          {leave.applicantType === 'student' ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : (
                            <Users className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {leave.applicantName}
                          </h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {leave.applicantType} · {leave.type} Leave
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPending
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : isApproved
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {leave.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Dates & duration */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1 mb-3">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Duration:</span>
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {leave.daysCount} {leave.daysCount === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {leave.startDate} to {leave.endDate}
                      </div>
                    </div>

                    {/* Reason statement */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                        Statement / Purpose:
                      </p>
                      <p className="italic">"{leave.reason}"</p>
                    </div>

                    {/* Review remarks if already processed */}
                    {leave.reviewerRemarks && (
                      <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs mb-3">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                          HOD Endorsement:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                          {leave.reviewerRemarks}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions if pending */}
                  {isPending ? (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                      <button
                        onClick={() => handleOpenDecisionModal(leave, 'rejected')}
                        className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleOpenDecisionModal(leave, 'approved')}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Adjudicated</span>
                      <span>{new Date(leave.appliedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Decision Reviewer Remarks Modal */}
      <Modal
        isOpen={!!remarksModalLeave}
        onClose={() => setRemarksModalLeave(null)}
        title={decisionAction === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        subtitle={`Candidate: ${remarksModalLeave?.applicantName} (${remarksModalLeave?.daysCount} Days)`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official HOD / Dean Comments & Directives
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setRemarksModalLeave(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDecision}
              className={`px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-xs cursor-pointer ${
                decisionAction === 'approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm {decisionAction === 'approved' ? 'Approval' : 'Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
