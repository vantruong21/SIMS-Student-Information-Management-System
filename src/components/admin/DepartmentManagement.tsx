import React, { useState } from 'react';
import { Department } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Building2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export const DepartmentManagement: React.FC = () => {
  const departments = useAppStore(state => state.departments);
  const addDepartment = useAppStore(state => state.addDepartment);
  const updateDepartment = useAppStore(state => state.updateDepartment);
  const deleteDepartment = useAppStore(state => state.deleteDepartment);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', head: '', description: '', facultyCount: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment(formData);
    setIsCreating(false);
    setFormData({ name: '', head: '', description: '', facultyCount: 0 });
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      head: dept.head,
      description: dept.description,
      facultyCount: dept.facultyCount || 0
    });
  };

  const handleSaveEdit = (deptId: string) => {
    updateDepartment(deptId, formData);
    setEditingId(null);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Academic Infrastructure
          </span>
          <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Department Management</h3>
          <p className="text-xs text-gray-500 mt-1">Manage academic departments, heads of department, and operational scale.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-5 bg-white/60 border border-white rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-indigo-950 border-b border-indigo-100 pb-2">New Department Setup</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-gray-500 mb-1">Department Name</label>
              <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Head of Department</label>
              <input required value={formData.head} onChange={e=>setFormData({...formData, head: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" placeholder="e.g. Dr. Turing" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-500 mb-1">Description</label>
              <input required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Faculty Count</label>
              <input required type="number" value={formData.facultyCount} onChange={e=>setFormData({...formData, facultyCount: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer">Create Department</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept: Department) => {
          const isEditing = editingId === dept.id;

          if (isEditing) {
            return (
              <div key={dept.id} className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-sm space-y-3">
                <input value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-sm font-bold" />
                <input value={formData.head} onChange={e=>setFormData({...formData, head: e.target.value})} className="w-full px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs" />
                <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs h-20 resize-none" />
                <input type="number" value={formData.facultyCount} onChange={e=>setFormData({...formData, facultyCount: parseInt(e.target.value)})} className="w-full px-2 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs" />
                
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                  <button onClick={() => handleSaveEdit(dept.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"><Save className="w-4 h-4" /></button>
                </div>
              </div>
            );
          }

          return (
            <div key={dept.id} className="group p-5 rounded-2xl bg-white/60 border border-white hover:bg-white transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(dept)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if(window.confirm('Delete department?')) deleteDepartment(dept.id); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h4 className="font-display font-bold text-indigo-950">{dept.name}</h4>
                <p className="text-xs font-medium text-indigo-600 mt-1">Head: {dept.head}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{dept.description}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-50 flex items-center justify-between text-[11px] text-gray-400 font-bold">
                <span>{dept.facultyCount} Faculty Members</span>
                <span>Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
