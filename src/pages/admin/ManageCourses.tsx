import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, Edit2, Trash2, Users, Calendar, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const ManageCourses: React.FC = () => {
  const { state, dispatch, showToast } = useApp();
  const { courses, students, subjects } = state;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science & Engineering',
    durationYears: 4,
    totalSemesters: 8,
    intakeCapacity: 60,
    hodName: 'Dr. Suresh Patil',
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      department: 'Computer Science & Engineering',
      durationYears: 4,
      totalSemesters: 8,
      intakeCapacity: 60,
      hodName: 'Senior Professor',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setFormData({
      code: c.code,
      name: c.name,
      department: c.department,
      durationYears: c.durationYears,
      totalSemesters: c.totalSemesters,
      intakeCapacity: c.intakeCapacity,
      hodName: c.hodName,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showToast('error', 'Please provide branch code and course name.');
      return;
    }

    if (editingCourse) {
      const updated: Course = { ...editingCourse, ...formData };
      dispatch({ type: 'UPDATE_COURSE', payload: updated });
      showToast('success', `Course ${formData.code} updated successfully.`);
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...formData,
      };
      dispatch({ type: 'ADD_COURSE', payload: newCourse });
      showToast('success', `New course ${formData.code} added.`);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmCourse) return;
    dispatch({ type: 'DELETE_COURSE', payload: deleteConfirmCourse.id });
    showToast('info', `Course ${deleteConfirmCourse.code} was removed.`);
    setDeleteConfirmCourse(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Degree Programs & Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage engineering degree disciplines, syllabus durations, and student capacities.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Card Grid with Hover Lift */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, idx) => {
          const enrolledCount = students.filter((st) => st.courseId === course.id).length;
          const subjectsCount = subjects.filter((sub) => sub.courseId === course.id).length;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmCourse(course)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {course.department}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Enrolled Students</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {enrolledCount} / {course.intakeCapacity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Curriculum Subjects</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {subjectsCount} Courses
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">HOD: {course.hodName}</span>
                <span className="font-medium shrink-0">{course.durationYears} Years</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Update Course Program' : 'Register New Course'}
        subtitle="Specify program code, intake quota, and department head."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Branch Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. COMP"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Intake Capacity
              </label>
              <input
                type="number"
                value={formData.intakeCapacity}
                onChange={(e) => setFormData({ ...formData, intakeCapacity: parseInt(e.target.value, 10) || 60 })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Program Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Computer Engineering"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              HOD / Coordinator Name
            </label>
            <input
              type="text"
              value={formData.hodName}
              onChange={(e) => setFormData({ ...formData, hodName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmCourse}
        title="Delete Course Program"
        message={`Are you sure you want to delete ${deleteConfirmCourse?.name} (${deleteConfirmCourse?.code})?`}
        confirmLabel="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmCourse(null)}
      />
    </div>
  );
};
