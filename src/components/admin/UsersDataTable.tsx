import React, { useState } from 'react';
import { 
  Filter, 
  Upload, 
  MoreVertical, 
  Trash2, 
  Check, 
  AlertCircle, 
  Plus,
  Search,
  X,
  Edit3,
  Lock,
  Unlock
} from 'lucide-react';
import { DataTable, Column } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GlassPanel } from '../ui/GlassPanel';
import { Student } from '../../types';
import { CsvImportWizard } from './CsvImportWizard';
import { GlassSkeleton } from '../GlassSkeleton';
import { GlassEmptyState } from '../GlassEmptyState';
import { Modal } from '../ui/Modal';

interface UsersDataTableProps {
  students: Student[];
  searchQuery: string;
  onApproveStudent: (id: string) => void;
  onDeleteStudent: (id: string) => void;
  onToggleLock: (email: string) => void;
  onShowToast: (msg: string, type?: 'success'|'error') => void;
  onAddLocalStudent: (student: Student) => void;
  onImportLocalStudents: (students: Student[]) => void;
  onEditLocalStudent?: (id: string, data: Partial<Student>) => void;
}

export const UsersDataTable: React.FC<UsersDataTableProps> = ({
  students,
  searchQuery,
  onApproveStudent,
  onDeleteStudent,
  onToggleLock,
  onShowToast,
  onAddLocalStudent,
  onImportLocalStudents,
  onEditLocalStudent
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  

  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProgram, setNewProgram] = useState('Software Engineering');
  const [newStatus, setNewStatus] = useState<'Active' | 'Pending'>('Active');
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const pageSize = 10;
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesProgram = programFilter === 'All' || student.program === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const columns: Column<Student>[] = [
    {
      header: 'Student Name',
      key: 'name',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/10 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-white">
            {s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="font-extrabold text-indigo-950">{s.name}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{s.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Student ID', key: 'id', className: 'text-gray-700 font-mono font-medium' },
    { header: 'Academic Program', key: 'program', className: 'text-gray-600 font-semibold' },
    { header: 'GPA', key: 'gpa', className: 'font-black text-gray-950', render: (s) => s.gpa ? s.gpa.toFixed(2) : '—' },
    { header: 'Credits', key: 'totalCredits', className: 'font-semibold text-gray-500', render: (s) => `${s.totalCredits || 0} hrs` },
    {
      header: 'Status',
      key: 'status',
      render: (s) => (
        <Badge variant={s.isLocked ? 'error' : s.status === 'Active' ? 'success' : 'warning'} dot>
          {s.isLocked ? 'Locked' : s.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {s.status === 'Pending' && (
            <button
              title="Approve Student"
              onClick={() => onApproveStudent(s.id)}
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors group/btn relative"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          <button 
            onClick={() => setEditingStudent(s)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn relative"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => {
              onToggleLock(s.email);
            }}
            className={`p-1.5 rounded-lg transition-colors group/btn relative ${s.isLocked ? 'text-indigo-600 hover:bg-indigo-50' : 'text-amber-600 hover:bg-amber-50'}`}
            title={s.isLocked ? "Unlock Account" : "Lock Account"}
          >
            {s.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => setDeleteConfirmId(s.id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group/btn relative"
            title="Delete Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    // We only pass the fields required by the register action in useAppStore
    // The Store/Facade handles ID generation and business logic
    const res = onAddLocalStudent({
      name: newName,
      email: newEmail,
      program: newProgram,
      status: newStatus as any
    } as any);

    if (res && res.success === false) {
      onShowToast(res.errors?.[0] || 'Failed to add student', 'error');
      return;
    }

    onShowToast(`Successfully added student profile: ${newName}`, 'success');
    
    setNewName('');
    setNewEmail('');
    setNewProgram('Software Engineering');
    setNewStatus('Active');
    setIsAddOpen(false);
  };

  const handleImportComplete = (imported: Student[]) => {
    onImportLocalStudents(imported);
    onShowToast(`Ingested ${imported.length} student records from CSV.`, 'success');
  };

  return (
    <div className="space-y-6">
      
      <GlassPanel className="text-left shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Student Records
            </span>
            <h3 className="font-display text-lg font-bold text-indigo-950 mt-1.5">Academic Student Registry</h3>
            <p className="text-xs text-gray-500 mt-0.5">Filter, inspect, approve, and upload bulk student enrollments.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end self-stretch lg:self-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white/75 border border-indigo-150 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-950 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-indigo-600 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Program Filter */}
            <div className="flex items-center gap-1.5 bg-white/75 border border-indigo-150 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-950 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>Program:</span>
              <select 
                value={programFilter} 
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-bold text-indigo-600 cursor-pointer"
              >
                <option value="All">All Majors</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Graphic Design">Graphic Design</option>
              </select>
            </div>

            {/* CSV Import */}
            <Button variant="secondary" icon={Upload} onClick={() => setIsImportOpen(true)}>
              Import CSV
            </Button>

            {/* Add Student */}
            <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
              Add Student
            </Button>
          </div>
        </div>

        <DataTable 
          data={filteredStudents}
          columns={columns}
          keyField="id"
          pageSize={pageSize}
          emptyMessage="No scholars found matching current criteria"
        />
      </GlassPanel>

      {/* Manual Add Form Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 my-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-950 font-display">New Scholar Profile</h3>
                <p className="text-xs text-gray-500 mt-1">Provision a new academic identity</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                  placeholder="e.g. Katherine Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                  placeholder="e.g. kat.johnson@elevate.edu"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Program</label>
                  <select
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-full"
                >
                  Provision Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Edit Form Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 my-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-950 font-display">Edit Scholar Profile</h3>
                <p className="text-xs text-gray-500 mt-1">Update academic identity</p>
              </div>
              <button 
                onClick={() => setEditingStudent(null)}
                className="p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onEditLocalStudent) {
                onEditLocalStudent(editingStudent.id, {
                  name: editingStudent.name,
                  email: editingStudent.email,
                  program: editingStudent.program,
                  status: editingStudent.status
                });
                onShowToast(`Successfully updated student profile: ${editingStudent.name}`);
              }
              setEditingStudent(null);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Program</label>
                  <select
                    value={editingStudent.program}
                    onChange={(e) => setEditingStudent({...editingStudent, program: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Graphic Design">Graphic Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value as 'Active' | 'Pending'})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="secondary"
                  className="w-full"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-full"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Wizard Modal */}
      {isImportOpen && (
        <CsvImportWizard 
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)} 
          onImportComplete={handleImportComplete} 
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteConfirmId} 
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-gray-600">
          <p>Are you sure you want to permanently delete this student profile? This action cannot be undone.</p>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
          <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            if (deleteConfirmId) {
              onDeleteStudent(deleteConfirmId);
              setDeleteConfirmId(null);
            }
          }}>
            Delete Profile
          </Button>
        </div>
      </Modal>

    </div>
  );
};
