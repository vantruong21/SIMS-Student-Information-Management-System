import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Check, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Student } from '../../types';
import { CsvImportWizard } from './CsvImportWizard';
import { GlassSkeleton } from '../GlassSkeleton';
import { GlassEmptyState } from '../GlassEmptyState';

interface UsersDataTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  students: Student[];
  onAddLocalStudent: (student: Student) => void;
  onImportLocalStudents: (students: Student[]) => void;
  onApproveStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const UsersDataTable: React.FC<UsersDataTableProps> = ({
  searchQuery,
  setSearchQuery,
  students,
  onAddLocalStudent,
  onImportLocalStudents,
  onApproveStudent,
  onDeleteStudent,
  onShowToast
}) => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Table Pagination & Filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');

  // Action menus tracking
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // New student states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProgram, setNewProgram] = useState('Software Engineering');
  const [newStatus, setNewStatus] = useState<'Active' | 'Pending'>('Active');

  // React hook dependency reset
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, programFilter, pageSize]);

  // Filter local student records
  const combinedStudents = React.useMemo(() => {
    const matchedLocal = students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) || 
        s.program.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesProgram = programFilter === 'All' || s.program === programFilter;
      
      return matchesSearch && matchesStatus && matchesProgram;
    });

    const startIndex = (page - 1) * pageSize;
    return matchedLocal.slice(startIndex, startIndex + pageSize);
  }, [students, searchQuery, statusFilter, programFilter, page, pageSize]);

  // Calculations for display pagination counts
  const totalRecords = React.useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) || 
        s.program.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesProgram = programFilter === 'All' || s.program === programFilter;
      
      return matchesSearch && matchesStatus && matchesProgram;
    }).length;
  }, [students, searchQuery, statusFilter, programFilter]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newStudent: Student = {
      id: `STD-${2500 + Math.floor(Math.random() * 5000)}`,
      name: newName,
      email: newEmail,
      program: newProgram,
      status: newStatus,
      gpa: parseFloat((3.3 + Math.random() * 0.7).toFixed(2)),
      totalCredits: 12 + Math.floor(Math.random() * 88)
    };

    onAddLocalStudent(newStudent);
    onShowToast(`Successfully added student profile: ${newName}`);
    
    // Reset form
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
      
      {/* Heavy-Duty Table Filter and Control Header */}
      <section className="glass-panel rounded-3xl p-6 shadow-sm border border-white/50 text-left">
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
            <button 
              onClick={() => setIsImportOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/70 border border-indigo-200 text-indigo-600 hover:bg-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 duration-200 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>

            {/* Add Student */}
            <button 
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold rounded-xl shadow-[0_6px_12px_rgba(79,70,229,0.15)] hover:shadow-[0_10px_20px_rgba(79,70,229,0.25)] hover:from-indigo-700 transition-all active:scale-95 duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Content */}
            {/* The Paginated Data Table */}
            <div className="overflow-hidden rounded-2xl border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] bg-white/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/45 backdrop-blur-sm text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 border-b border-white/50">
                      <th className="py-4 px-6 font-black">Student Name</th>
                      <th className="py-4 px-6 font-black">Student ID</th>
                      <th className="py-4 px-6 font-black">Academic Program</th>
                      <th className="py-4 px-6 font-black">GPA</th>
                      <th className="py-4 px-6 font-black">Credits</th>
                      <th className="py-4 px-6 font-black">Status</th>
                      <th className="py-4 px-6 font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm divide-y divide-white/20">
                    {combinedStudents.length > 0 ? (
                      combinedStudents.map((student) => {
                        const initials = student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase();

                        return (
                          <tr 
                            key={student.id}
                            className="hover:bg-slate-50/30 transition-colors group relative"
                          >
                            {/* Avatar & Name */}
                            <td className="py-4 px-6 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/10 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-white">
                                {initials}
                              </div>
                              <div className="text-left">
                                <p className="font-extrabold text-indigo-950 group-hover:text-indigo-600 transition-colors">
                                  {student.name}
                                </p>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{student.email}</p>
                              </div>
                            </td>

                            {/* Student ID */}
                            <td className="py-4 px-6 text-gray-700 font-mono font-medium">
                              {student.id}
                            </td>

                            {/* Program */}
                            <td className="py-4 px-6 text-gray-600 font-semibold">
                              {student.program}
                            </td>

                            {/* GPA */}
                            <td className="py-4 px-6 font-black text-gray-950">
                              {student.gpa ? student.gpa.toFixed(2) : '—'}
                            </td>

                            {/* Credits */}
                            <td className="py-4 px-6 font-semibold text-gray-500">
                              {student.totalCredits || 0} hrs
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[10px] font-black ${
                                student.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {student.status}
                              </span>
                            </td>

                            {/* Actions Dropdown */}
                            <td className="py-4 px-6 text-right relative">
                              <div className="flex items-center justify-end gap-1.5">
                                {student.status === 'Pending' && (
                                  <button
                                    title="Approve Student"
                                    onClick={() => onApproveStudent(student.id)}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <div className="relative">
                                  <button 
                                    onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all cursor-pointer"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {activeMenuId === student.id && (
                                    <>
                                      <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                                      <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-150 rounded-xl shadow-lg p-1.5 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                                        {student.status === 'Pending' && (
                                          <button 
                                            onClick={() => {
                                              onApproveStudent(student.id);
                                              setActiveMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Approve</span>
                                          </button>
                                        )}
                                        <button 
                                          onClick={() => {
                                            onDeleteStudent(student.id);
                                            setActiveMenuId(null);
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                          <span>Delete Profile</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8">
                          <GlassEmptyState
                            title="No scholars found matching current criteria"
                            description="There are no registered students or newly imported profiles that match the filtered parameters. Modify your search query or status toggle to retrieve other accounts."
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-indigo-50/40">
              <span className="text-xs text-indigo-900/60 font-semibold">
                Showing page <b>{page}</b> of <b>{totalPages}</b> ({totalRecords} synchronized records)
              </span>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>Show</span>
                  <select 
                    value={pageSize} 
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="bg-white/60 border border-indigo-100 rounded-lg px-2 py-1 text-indigo-600 font-bold outline-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>records</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-xl bg-white/70 border border-indigo-150 text-indigo-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-indigo-950 px-2 font-mono">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl bg-white/70 border border-indigo-150 text-indigo-600 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
      </section>

      {/* CSV Import Wizard Overlay */}
      <CsvImportWizard
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Add New Student Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-indigo-950/25 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-[28px] border border-white/80 p-6 md:p-8 w-full max-w-md shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-left">
            <button 
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-indigo-950 transition-colors cursor-pointer"
            >
              ×
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Registration Queue
              </span>
              <h4 className="font-display text-lg font-bold text-indigo-950 mt-1.5">Add Student Profile</h4>
              <p className="text-xs text-gray-500 mt-0.5">Initialize a new secure student account record.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Academic Email</label>
                <input 
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="s.jenkins@elevate.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Academic Program</label>
                <select 
                  value={newProgram}
                  onChange={e => setNewProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm cursor-pointer"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Graphic Design">Graphic Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Initial Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input 
                      type="radio" 
                      name="new_status" 
                      checked={newStatus === 'Active'}
                      onChange={() => setNewStatus('Active')}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Active immediately</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input 
                      type="radio" 
                      name="new_status" 
                      checked={newStatus === 'Pending'}
                      onChange={() => setNewStatus('Pending')}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Approval queue</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/15 transition-all cursor-pointer text-xs"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
