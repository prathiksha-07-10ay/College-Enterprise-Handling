import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Edit2, Trash2, Search, Filter, BookOpen, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';

export const ManageSubjects: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { subjects, courses, staff } = state;

  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteConfirmSubject, setDeleteConfirmSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    courseId: 'course-1',
    staffId: 'staff-1',
    semester: 4,
    credits: 4,
    weeklyHours: 4,
  });

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase());
      const matchCourse = selectedCourse === 'All' || s.courseId === selectedCourse;
      return matchSearch && matchCourse;
    });
  }, [subjects, search, selectedCourse]);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      code: `CSC${String(500 + subjects.length + 1)}`,
      name: '',
      courseId: 'course-1',
      staffId: staff[0]?.id || 'staff-1',
      semester: 4,
      credits: 4,
      weeklyHours: 4,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData({
      code: sub.code,
      name: sub.name,
      courseId: sub.courseId,
      staffId: sub.staffId,
      semester: sub.semester,
      credits: sub.credits,
      weeklyHours: sub.weeklyHours,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast('error', 'Please fill subject code and title.');
      return;
    }

    if (editingSubject) {
      const updated: Subject = { ...editingSubject, ...formData };
      dispatch({ type: 'UPDATE_SUBJECT', payload: updated });
      showToast('success', `Subject ${formData.code} updated.`);
    } else {
      const newSubject: Subject = {
        id: `subj-${Date.now()}`,
        ...formData,
      };
      dispatch({ type: 'ADD_SUBJECT', payload: newSubject });
      showToast('success', `Subject ${formData.code} created and assigned.`);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmSubject) return;
    dispatch({ type: 'DELETE_SUBJECT', payload: deleteConfirmSubject.id });
    showToast('info', `Subject ${deleteConfirmSubject.code} deleted.`);
    setDeleteConfirmSubject(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Curriculum & Subject Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign curriculum modules to departments and designate faculty instructors.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject by code or name..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Course Streams</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          title="No subjects found"
          description="Try selecting another course or register a new subject."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedCourse('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((sub) => {
            const course = courses.find((c) => c.id === sub.courseId);
            const assignedFaculty = staff.find((st) => st.id === sub.staffId);

            return (
              <motion.div
                key={sub.id}
                whileHover={{ y: -3 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Sem {sub.semester} · {sub.credits} Credits
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">{course?.name}</p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <img
                      src={assignedFaculty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={assignedFaculty?.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {assignedFaculty?.name || 'Unassigned Faculty'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {assignedFaculty?.designation || 'Instructor in charge'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400">{sub.weeklyHours} hrs / week</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmSubject(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Edit Subject Details' : 'Register New Subject'}
        subtitle="Specify curriculum codes and allocate instructor in charge."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CSC501"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Name / Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Stream
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Instructor
              </label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.department.slice(0, 15)}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credit Weightage
              </label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value, 10) || 4 })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Hours
              </label>
              <input
                type="number"
                value={formData.weeklyHours}
                onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value, 10) || 4 })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

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
              {editingSubject ? 'Save Changes' : 'Allocate Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmSubject}
        title="Delete Subject"
        message={`Are you sure you want to remove ${deleteConfirmSubject?.name} (${deleteConfirmSubject?.code})?`}
        confirmLabel="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmSubject(null)}
      />
    </div>
  );
};
