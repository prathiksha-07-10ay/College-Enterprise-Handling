import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest } from '../../types';

export const StaffLeave: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { currentUser, leaves, staff } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const myLeaves = leaves.filter((l) => l.applicantId === staffProfile?.id);

  const [formData, setFormData] = useState({
    startDate: '2026-11-12',
    endDate: '2026-11-14',
    type: 'Duty' as LeaveRequest['type'],
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      showToast('error', 'Please articulate the justification for absence.');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const daysDiff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      applicantId: staffProfile.id,
      applicantType: 'staff',
      applicantName: staffProfile.name,
      applicantRole: 'staff',
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysCount: daysDiff,
      type: formData.type,
      reason: formData.reason,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    dispatch({
      type: 'APPLY_LEAVE',
      payload: newLeave,
    });

    showToast('success', 'Leave application submitted to HOD for approval.', 'Application Lodged');
    setFormData({
      startDate: '',
      endDate: '',
      type: 'Duty',
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Faculty Leave Applications & Sanctions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Apply for duty, casual, or medical leave and track HOD endorsement status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Application Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-500" />
            <span>Apply for New Leave</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Leave Classification
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="Duty">Duty Leave (Conferences / University Meetings)</option>
              <option value="Casual">Casual Leave (Personal Work)</option>
              <option value="Medical">Medical Leave</option>
              <option value="Academic">Academic / Research Presentation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                To Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason / Justification
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="State the purpose of absence and lecture adjustments..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-3 text-slate-900 dark:text-white outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            Submit Application
          </button>
        </form>

        {/* Right: History Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              My Leave History & Status
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Days</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {l.type}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-xs">
                        {l.startDate} ~ {l.endDate}
                      </td>
                      <td className="py-3 px-3 font-bold">{l.daysCount}</td>
                      <td className="py-3 px-3 text-slate-500 max-w-[160px] truncate" title={l.reason}>
                        {l.reason}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            l.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                              : l.status === 'approved'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {l.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
