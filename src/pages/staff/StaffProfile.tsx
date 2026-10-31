import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, BookOpen, Upload, Save, Award, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StaffProfile: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { currentUser, staff, subjects } = state;

  const staffProfile = staff.find(
    (s) => s.id === currentUser?.id || s.email === currentUser?.email
  ) || staff[0];

  const mySubjects = subjects.filter((s) => (staffProfile?.assignedSubjectIds || []).includes(s.id));

  const [formData, setFormData] = useState({
    name: staffProfile?.name || '',
    email: staffProfile?.email || '',
    phone: staffProfile?.phone || '',
    department: staffProfile?.department || '',
    designation: staffProfile?.designation || '',
    qualification: staffProfile?.qualification || '',
    avatar: staffProfile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffProfile) {
      dispatch({
        type: 'UPDATE_STAFF',
        payload: {
          ...staffProfile,
          ...formData,
        },
      });
      dispatch({
        type: 'UPDATE_USER_PROFILE',
        payload: formData,
      });
      showToast('success', 'Faculty profile saved.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Faculty Academic Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Maintain your institutional credentials, teaching qualifications, and contact coordinates.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Avatar & Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-md"
            />
            <label className="absolute inset-0 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-semibold">Update</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{formData.name}</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              {formData.designation} · {formData.department}
            </p>
            <p className="text-xs text-slate-400">{formData.qualification}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Qualification
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Assigned Subjects Summary */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Active Teaching Allocations
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mySubjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">
                    {sub.code}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {sub.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{sub.credits} Credits</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-4 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
