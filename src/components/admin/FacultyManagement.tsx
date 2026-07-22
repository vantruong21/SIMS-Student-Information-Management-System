import React, { useState } from 'react';
import { 
  Filter, 
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
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../store/useAppStore';

interface FacultyManagementProps {
  searchQuery: string;
  onShowToast: (msg: string, type?: 'success'|'error') => void;
}

export const FacultyManagement: React.FC<FacultyManagementProps> = ({
  searchQuery,
  onShowToast
}) => {
  const facultyList = useAppStore(state => state.faculty);
  const addFaculty = useAppStore(state => state.addFaculty);
  const updateFaculty = useAppStore(state => state.updateFaculty);
  const deleteFaculty = useAppStore(state => state.deleteFaculty);
  const toggleUserLock = useAppStore(state => state.toggleUserLock);


  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  const pageSize = 10;
  
  const filteredFaculty = facultyList.filter(f => {
    return f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           f.id?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const columns: Column<any>[] = [
    {
      header: 'Faculty Name',
      key: 'name',
      render: (f) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/10 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-white">
            {f.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="font-extrabold text-indigo-950">{f.name}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{f.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Faculty ID', key: 'id', className: 'text-gray-700 font-mono font-medium' },
    { header: 'Phone', key: 'phone', className: 'text-gray-600', render: (f) => f.phone || '—' },
    {
      header: 'Status',
      key: 'status',
      render: (f) => (
        <Badge variant={f.isLocked ? 'error' : f.isActive ? 'success' : 'warning'} dot>
          {f.isLocked ? 'Locked' : f.isActive ? 'Active' : 'Pending'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      className: 'text-right',
      render: (f) => (
        <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {(!f.isActive && !f.isLocked) && (
            <button
              title="Approve Faculty"
              onClick={() => {
                updateFaculty(f.id, { isActive: true });
                onShowToast(`Approved faculty profile: ${f.name}`);
              }}
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors group/btn relative"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button 
            onClick={() => setEditingFaculty(f)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn relative"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => {
              toggleUserLock(f.email);
              onShowToast(`Toggled lock status for ${f.name}`);
            }}
            className={`p-1.5 rounded-lg transition-colors group/btn relative ${f.isLocked ? 'text-indigo-600 hover:bg-indigo-50' : 'text-amber-600 hover:bg-amber-50'}`}
            title={f.isLocked ? "Unlock Account" : "Lock Account"}
          >
            {f.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => setDeleteConfirmId(f.id)}
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

    const res = addFaculty({ name: newName, email: newEmail, phone: newPhone });
    if (res.success) {
      onShowToast(`Successfully added faculty profile: ${newName}`);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setIsAddOpen(false);
    } else {
      onShowToast(res.errors?.[0] || 'Error adding faculty', 'error');
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaculty) {
      updateFaculty(editingFaculty.id, {
        name: editingFaculty.name,
        email: editingFaculty.email,
        phone: editingFaculty.phone
      });
      onShowToast(`Successfully updated faculty profile: ${editingFaculty.name}`);
      setEditingFaculty(null);
    }
  };

  return (
    <div className="space-y-6">
      
      <GlassPanel className="text-left shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Faculty Records
            </span>
            <h3 className="font-display text-lg font-bold text-indigo-950 mt-1.5">Academic Staff Registry</h3>
            <p className="text-xs text-gray-500 mt-0.5">Manage professors, instructors, and staff.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end self-stretch lg:self-auto">
            {/* Add Faculty */}
            <Button variant="primary" icon={Plus} onClick={() => setIsAddOpen(true)}>
              Add Faculty
            </Button>
          </div>
        </div>

        <DataTable 
          data={filteredFaculty}
          columns={columns}
          keyField="id"
          pageSize={pageSize}
          emptyMessage="No faculty found matching current criteria"
        />
      </GlassPanel>

      {/* Manual Add Form Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 my-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-950 font-display">New Faculty Profile</h3>
                <p className="text-xs text-gray-500 mt-1">Provision a new academic staff account</p>
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
                  placeholder="e.g. Dr. Alan Turing"
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
                  placeholder="e.g. aturing@elevate.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                  placeholder="e.g. +1 555-0199"
                />
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
      {editingFaculty && (
        <div className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 my-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-950 font-display">Edit Faculty Profile</h3>
                <p className="text-xs text-gray-500 mt-1">Update academic staff identity</p>
              </div>
              <button 
                onClick={() => setEditingFaculty(null)}
                className="p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingFaculty.name}
                  onChange={(e) => setEditingFaculty({...editingFaculty, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingFaculty.email}
                  onChange={(e) => setEditingFaculty({...editingFaculty, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  value={editingFaculty.phone || ''}
                  onChange={(e) => setEditingFaculty({...editingFaculty, phone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-sm"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="secondary"
                  className="w-full"
                  onClick={() => setEditingFaculty(null)}
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

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!deleteConfirmId} 
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-gray-600">
          <p>Are you sure you want to permanently delete this faculty profile? This action cannot be undone.</p>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
          <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            if (deleteConfirmId) {
              const fName = facultyList.find(f => f.id === deleteConfirmId)?.name || 'Faculty';
              deleteFaculty(deleteConfirmId);
              onShowToast(`Deleted faculty profile: ${fName}`);
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
