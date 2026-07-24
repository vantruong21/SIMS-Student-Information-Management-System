import React, { useState } from 'react';
import { Department } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { DataTable, Column } from '../ui/DataTable';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

export const DepartmentManagement: React.FC = () => {
  const departments = useAppStore(state => state.departments);
  const faculty = useAppStore(state => state.faculty);
  const activeFaculty = faculty.filter(f => f.isActive !== false);
  const addDepartment = useAppStore(state => state.addDepartment);
  const updateDepartment = useAppStore(state => state.updateDepartment);
  const deleteDepartment = useAppStore(state => state.deleteDepartment);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [selectedFacultyIds, setSelectedFacultyIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '', head: activeFaculty[0]?.name || 'Staff Academic', description: '', facultyCount: 0
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', head: activeFaculty[0]?.name || 'Staff Academic', description: '', facultyCount: 0 });
    setSelectedFacultyIds([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingId(dept.id);
    const linkedFacultyIds = faculty
      .filter(f => f.department === dept.name || f.department === dept.id)
      .map(f => f.id);

    setFormData({
      name: dept.name,
      head: dept.head,
      description: dept.description,
      facultyCount: linkedFacultyIds.length || dept.facultyCount || 0
    });
    setSelectedFacultyIds(linkedFacultyIds);
    setIsModalOpen(true);
  };

  const toggleFacultyMember = (id: string) => {
    setSelectedFacultyIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setFormData(f => ({ ...f, facultyCount: next.length }));
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      facultyCount: selectedFacultyIds.length,
      facultyIds: selectedFacultyIds
    };

    if (editingId) {
      await updateDepartment(editingId, payload);
    } else {
      await addDepartment(payload);
    }
    setIsModalOpen(false);
  };

  const columns: Column<Department>[] = [
    {
      header: 'Department',
      key: 'name',
      render: (dept) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-indigo-950">{dept.name}</div>
            <div className="text-xs text-gray-500 w-48 truncate">{dept.description}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Head of Department',
      key: 'head',
      render: (dept) => {
        const headName = dept.head || 'Staff Academic';
        const initials = headName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2) || 'SA';
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
              {initials}
            </div>
            <span className="font-semibold text-gray-700 text-sm">{headName}</span>
          </div>
        );
      }
    },
    {
      header: 'Faculty Count',
      key: 'facultyCount',
      render: (dept) => (
        <Badge variant="info">{dept.facultyCount || 0} Members</Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (dept) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(dept)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={async () => await deleteDepartment(dept.id)}>
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
              Academic Infrastructure
            </span>
            <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Department Management</h3>
            <p className="text-xs text-gray-500 mt-1">Manage academic departments, heads of department, and operational scale.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Add Department
          </Button>
        </div>

        <DataTable 
          data={departments}
          columns={columns}
          keyField="id"
          pageSize={10}
        />
      </GlassPanel>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Department' : 'New Department Setup'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Department Name</label>
              <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Head of Department</label>
              <select value={formData.head} onChange={e=>setFormData({...formData, head: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm cursor-pointer">
                <option value="Staff Academic">Staff Academic</option>
                {activeFaculty.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Description</label>
              <input required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm" placeholder="Focuses on computational theory..." />
            </div>

            {/* Multi-select Faculty Members */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Faculty Members (Thành viên khoa)
                </label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {selectedFacultyIds.length} Selected
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-200/80 rounded-2xl p-3 bg-gray-50/30 space-y-2">
                {activeFaculty.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-2">No active faculty available to assign.</p>
                ) : (
                  activeFaculty.map(f => {
                    const isChecked = selectedFacultyIds.includes(f.id);
                    return (
                      <label 
                        key={f.id} 
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-indigo-50/80 border-indigo-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFacultyMember(f.id)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400 border-gray-300 cursor-pointer"
                          />
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                            {f.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-indigo-950">{f.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{f.email}</p>
                          </div>
                        </div>
                        {f.name === formData.head && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Head of Dept
                          </span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

