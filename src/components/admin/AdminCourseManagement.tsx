import React, { useState } from 'react';
import { Course } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Settings2, Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react';

interface AdminCourseManagementProps {
  courses: Course[];
}

// Available faculty members (mock list)
const FACULTY_MEMBERS = [
  'Dr. Smith',
  'Dr. Jones',
  'Prof. Turing',
  'Prof. Miller',
  'Dr. Davis',
  'Prof. Wilson',
  'Prof. Carter',
  'Dr. Lee',
  'Prof. White',
  'Dr. Richard Feynman',
  'Prof. Marie Curie',
  'Staff Academic'
];

export const AdminCourseManagement: React.FC<AdminCourseManagementProps> = ({ courses }) => {
  const addCourse = useAppStore(state => state.addCourse);
  const updateCourse = useAppStore(state => state.updateCourse);
  const deleteCourse = useAppStore(state => state.deleteCourse);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: '', name: '', instructor: FACULTY_MEMBERS[0], schedule: '', credits: 3, capacity: 30
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCourse(formData);
    setIsCreating(false);
    setFormData({ code: '', name: '', instructor: FACULTY_MEMBERS[0], schedule: '', credits: 3, capacity: 30 });
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      code: course.code,
      name: course.name,
      instructor: course.instructor,
      schedule: course.schedule,
      credits: course.credits || 3,
      capacity: course.capacity || 30
    });
  };

  const handleSaveEdit = (courseId: string) => {
    updateCourse(courseId, formData);
    setEditingId(null);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Faculty Allocation
          </span>
          <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Course & Scheduling Management</h3>
          <p className="text-xs text-gray-500 mt-1">Manage teaching assignments, timeslots, room coordinates, and credit metrics.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-5 bg-white/60 border border-white rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-indigo-950 border-b border-indigo-100 pb-2">New Course Configuration</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium">
            <div>
              <label className="block text-gray-500 mb-1">Code</label>
              <input required value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" placeholder="e.g. CS101" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Name</label>
              <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Instructor</label>
              <select value={formData.instructor} onChange={e=>setFormData({...formData, instructor: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400">
                {FACULTY_MEMBERS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Schedule</label>
              <input required value={formData.schedule} onChange={e=>setFormData({...formData, schedule: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" placeholder="Mon/Wed 9:00 AM" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Credits</label>
              <input required type="number" value={formData.credits} onChange={e=>setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer">Create Course</button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 text-xs font-bold uppercase text-gray-500 border-b border-white/50">
              <th className="p-4">Code</th>
              <th className="p-4">Title</th>
              <th className="p-4">Faculty</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-white/20">
            {courses.map(course => {
              const isEditing = editingId === course.id;
              
              if (isEditing) {
                return (
                  <tr key={course.id} className="bg-white/50 transition-colors">
                    <td className="p-3"><input value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="w-full px-2 py-1.5 rounded bg-white border border-gray-200" disabled /></td>
                    <td className="p-3"><input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-2 py-1.5 rounded bg-white border border-gray-200" /></td>
                    <td className="p-3">
                      <select value={formData.instructor} onChange={e=>setFormData({...formData, instructor: e.target.value})} className="w-full px-2 py-1.5 rounded bg-white border border-gray-200">
                        {FACULTY_MEMBERS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </td>
                    <td className="p-3"><input value={formData.schedule} onChange={e=>setFormData({...formData, schedule: e.target.value})} className="w-full px-2 py-1.5 rounded bg-white border border-gray-200" /></td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleSaveEdit(course.id)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors cursor-pointer"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={course.id} className="hover:bg-white/40 transition-colors group">
                  <td className="p-4 font-mono font-bold text-indigo-950">{course.code}</td>
                  <td className="p-4 text-gray-700 font-medium">{course.name}</td>
                  <td className="p-4 text-gray-700">{course.instructor}</td>
                  <td className="p-4 text-gray-500">{course.schedule}</td>
                  <td className="p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(course)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if(window.confirm('Delete course?')) deleteCourse(course.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
