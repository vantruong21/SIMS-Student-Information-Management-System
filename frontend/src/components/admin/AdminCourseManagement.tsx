import React, { useState } from 'react';
import { Course } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Settings2, Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { DataTable, Column } from '../ui/DataTable';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface AdminCourseManagementProps {
  courses: Course[];
}



export const AdminCourseManagement: React.FC<AdminCourseManagementProps> = ({ courses }) => {
  const faculty = useAppStore(state => state.faculty);
  const activeFaculty = faculty.filter(f => f.isActive !== false);
  const addCourse = useAppStore(state => state.addCourse);
  const updateCourse = useAppStore(state => state.updateCourse);
  const deleteCourse = useAppStore(state => state.deleteCourse);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: '', name: '', instructor: activeFaculty[0]?.name || 'Staff Academic', schedule: '', credits: 3, capacity: 30
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ code: '', name: '', instructor: activeFaculty[0]?.name || 'Staff Academic', schedule: '', credits: 3, capacity: 30 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      code: course.code,
      name: course.name,
      instructor: course.instructor,
      schedule: course.schedule,
      credits: course.credits || 3,
      capacity: course.capacity || 30
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCourse(editingId, formData);
    } else {
      await addCourse(formData);
    }
    setIsModalOpen(false);
  };

  const columns: Column<Course>[] = [
    {
      header: 'Course',
      key: 'courseInfo',
      render: (course) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-indigo-950">{course.name}</div>
            <div className="text-xs text-gray-500 font-mono">{course.code}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Instructor',
      key: 'instructor',
      render: (course) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
            {course.instructor.split(' ').map(n => n[0]).join('').substring(0,2)}
          </div>
          <span className="font-semibold text-gray-700 text-sm">{course.instructor}</span>
        </div>
      )
    },
    {
      header: 'Schedule & Capacity',
      key: 'schedule',
      render: (course) => (
        <div>
          <div className="text-sm text-gray-700">{course.schedule}</div>
          <div className="text-xs text-gray-500">{course.assignedCount || 0} / {course.capacity || 30} Enrolled</div>
        </div>
      )
    },
    {
      header: 'Credits',
      key: 'credits',
      render: (course) => (
        <Badge variant="info">{course.credits || 3} Credits</Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (course) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(course)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={async () => await deleteCourse(course.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <GlassPanel>
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Faculty Allocation
            </span>
            <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Course & Scheduling Management</h3>
            <p className="text-xs text-gray-500 mt-1">Manage teaching assignments, timeslots, room coordinates, and credit metrics.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Add Course
          </Button>
        </div>

        <DataTable 
          data={courses}
          columns={columns}
          keyField="id"
          pageSize={10}
        />
      </GlassPanel>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Course Configuration' : 'New Course Configuration'}
        maxWidth="max-w-2xl"
      >
        <form id="courseForm" onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Course Code</label>
              <input required value={formData.code} onChange={e=>setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" placeholder="e.g. CS101" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Course Name</label>
              <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" placeholder="e.g. Intro to Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Instructor</label>
              <select value={formData.instructor} onChange={e=>setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm cursor-pointer">
                <option value="Staff Academic">Staff Academic</option>
                {activeFaculty.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Schedule</label>
              <input required value={formData.schedule} onChange={e=>setFormData({...formData, schedule: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" placeholder="Mon/Wed 9:00 AM" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Credits</label>
              <input required type="number" min="1" max="6" value={formData.credits} onChange={e=>setFormData({...formData, credits: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Capacity</label>
              <input required type="number" min="1" value={formData.capacity} onChange={e=>setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" />
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
