import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  BookOpen, 
  CheckSquare, 
  Square, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  Database
} from 'lucide-react';
import { Student, Course } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface DualPanelAllocationProps {
  students: Student[];
  courses: Course[];
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

interface TargetClass {
  id: string;
  code: string;
  name: string;
  instructor: string;
  capacity: number;
  assignedCount: number;
  assignedStudents: Student[];
}

export const DualPanelAllocation: React.FC<DualPanelAllocationProps> = ({
  students,
  courses,
  onShowToast
}) => {
  const enrollments = useAppStore(state => state.enrollments);
  
  // Target class configurations with dynamic state reading from store
  const classes = useMemo<TargetClass[]>(() => {
    return courses.map(course => {
      // Find all enrollments for this course
      const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
      
      // Map to actual student objects
      const assignedStudents = courseEnrollments
        .map(e => students.find(s => s.id === e.studentId))
        .filter((s): s is Student => s !== undefined);
        
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        instructor: course.instructor || 'Staff Academic',
        capacity: course.capacity || 35,
        assignedCount: assignedStudents.length,
        assignedStudents: assignedStudents
      };
    });
  }, [courses, enrollments, students]);

  const [selectedClassId, setSelectedClassId] = useState<string>(courses[0]?.id || '');
  
  React.useEffect(() => {
    if (!selectedClassId && courses.length > 0) {
      setSelectedClassId(courses[0].id);
    } else if (selectedClassId && !courses.find(c => c.id === selectedClassId)) {
      setSelectedClassId(courses[0]?.id || '');
    }
  }, [courses, selectedClassId]);
  const assignStudentsToCourse = useAppStore(state => state.assignStudentsToCourse);
  const removeStudentFromCourse = useAppStore(state => state.removeStudentFromCourse);
  const [unassignedSearch, setUnassignedSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // Get active target class
  const activeClass = useMemo(() => {
    return classes.find(c => c.id === selectedClassId);
  }, [classes, selectedClassId]);

  // Generate lists of "unassigned" students.
  // In a real database, we look for students not enrolled in this specific class.
  // Let's filter students whose ID is not already assigned to the active class.
  const unassignedStudentsList = useMemo(() => {
    if (!activeClass) return [];
    
    // Filter active student profiles that are not in the assignedStudents list of active class
    return students.filter(student => {
      // Must be Active status to be eligible for assignment
      if (student.status !== 'Active') return false;

      const isAlreadyAssigned = activeClass.assignedStudents.some(as => as.id === student.id);
      if (isAlreadyAssigned) return false;

      // Filter search
      const q = unassignedSearch.toLowerCase();
      if (q) {
        return student.name.toLowerCase().includes(q) || 
               student.id.toLowerCase().includes(q) || 
               student.program.toLowerCase().includes(q);
      }
      return true;
    });
  }, [students, activeClass, unassignedSearch]);

  // Toggle single selection
  const handleToggleSelect = (studentId: string) => {
    setSelectedStudentIds(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  // Select all visible
  const handleSelectAll = () => {
    const visibleIds = unassignedStudentsList.map(s => s.id);
    const allSelected = visibleIds.every(id => selectedStudentIds.has(id));

    setSelectedStudentIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach(id => next.delete(id));
      } else {
        visibleIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Mass assignment logic
  const handlePerformAllocation = () => {
    if (selectedStudentIds.size === 0 || !selectedClassId || !activeClass) {
      onShowToast('Please select at least one student from the unassigned pool.', 'error');
      return;
    }
    const studentIds = Array.from<string>(selectedStudentIds);
    if (activeClass.assignedCount + studentIds.length > activeClass.capacity) {
      onShowToast(`Operation aborted. Assignment exceeds the maximum capacity of ${activeClass.capacity} for this section.`, 'error');
      return;
    }
    assignStudentsToCourse(studentIds, selectedClassId);
    onShowToast(`Successfully allocated ${studentIds.length} students to ${activeClass.code}.`, 'success');
    setSelectedStudentIds(new Set());
  };
  // Remove assignment
  const handleRemoveAssignment = (studentId: string) => {
    if (!selectedClassId) return;
    removeStudentFromCourse(studentId, selectedClassId);
    onShowToast(`Released student from allocation draft.`, 'success');
  };
  const isAllSelected = unassignedStudentsList.length > 0 && 
    unassignedStudentsList.every(s => selectedStudentIds.has(s.id));

  return (
    <div className="space-y-6 text-left">
      
      {/* Intro Header */}
      <section className="glass-panel rounded-3xl p-6 shadow-sm border border-white/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Smart Scheduler Engine
            </span>
            <h3 className="font-display text-xl font-extrabold text-indigo-950 mt-1">Smart Academic Allocation Matrix</h3>
            <p className="text-xs text-gray-500 mt-0.5">Streamline section placement, mass-enroll students, and preview class capacities in real-time.</p>
          </div>
        </div>
      </section>

      {/* Main Dual-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT PANEL: Unassigned Students */}
        <div className="lg:col-span-5 flex flex-col glass-panel rounded-3xl p-5 border border-white/50 h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-150/40 mb-4 shrink-0">
            <div className="text-left">
              <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Eligible Candidates</span>
              </h4>
              <p className="text-[10px] text-gray-400 font-medium">Unassigned Active Students pool</p>
            </div>
            
            {/* Selection status */}
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100/40 px-2.5 py-1 rounded-full">
              {selectedStudentIds.size} selected
            </span>
          </div>

          {/* Search bar inside panel */}
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={unassignedSearch}
              onChange={e => setUnassignedSearch(e.target.value)}
              placeholder="Search by name, ID or major..."
              className="w-full pl-9 pr-4 py-2 bg-white/70 hover:bg-white border border-indigo-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-xs"
            />
          </div>

          {/* Select all header */}
          <div className="flex items-center justify-between py-2 px-3 bg-indigo-50/30 rounded-xl border border-indigo-100/20 mb-3 shrink-0 text-xs">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 font-bold text-indigo-950 hover:text-indigo-600 cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-indigo-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>Select All Eligible ({unassignedStudentsList.length})</span>
            </button>
          </div>

          {/* Scrollable list pool */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <AnimatePresence initial={false}>
              {unassignedStudentsList.length > 0 ? (
                unassignedStudentsList.map((student) => {
                  const isSelected = selectedStudentIds.has(student.id);
                  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => handleToggleSelect(student.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                          : 'bg-white/40 border-indigo-100/30 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="w-8 h-8 rounded-lg bg-indigo-100/40 border border-white text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {initials}
                        </div>

                        <div className="text-left">
                          <p className="text-xs font-extrabold text-indigo-950">{student.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium font-mono">{student.id} • {student.program}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono bg-white border border-gray-150 text-indigo-950 px-2 py-0.5 rounded font-bold">
                        {student.gpa ? student.gpa.toFixed(2) : '—'} GPA
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-gray-400 font-bold flex flex-col items-center justify-center gap-2">
                  <Database className="w-8 h-8 text-indigo-200" />
                  <span className="text-xs">No eligible candidates match parameters</span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MIDDLE COLUMN: Translocate button */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-3 gap-4 shrink-0">
          <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-100 to-transparent" />
          
          <button
            onClick={handlePerformAllocation}
            disabled={selectedStudentIds.size === 0}
            className={`w-full lg:w-14 lg:h-14 py-4 lg:py-0 rounded-2xl flex flex-col lg:flex-row items-center justify-center gap-2 text-white font-extrabold transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${
              selectedStudentIds.size > 0
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/10 hover:shadow-indigo-500/20'
                : 'bg-gray-300 pointer-events-none opacity-50'
            }`}
            title="Mass Assign selected students to target class section"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="lg:hidden text-xs">Commit Mass Allocation ({selectedStudentIds.size})</span>
          </button>
          
          <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-100 to-transparent" />
        </div>

        {/* RIGHT PANEL: Target Class Assignee Monitor */}
        <div className="lg:col-span-5 flex flex-col glass-panel rounded-3xl p-5 border border-white/50 h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-150/40 mb-4 shrink-0">
            <div className="text-left">
              <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Target Class Selection</span>
              </h4>
              <p className="text-[10px] text-gray-400 font-medium">Select course section coordinates</p>
            </div>
          </div>

          {/* Class Dropdown Selection Selector */}
          <div className="bg-white/70 border border-indigo-150 rounded-2xl p-3 shadow-inner mb-4 shrink-0 text-left">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Active Target Class Section</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full bg-transparent font-extrabold text-sm text-indigo-950 focus:outline-none cursor-pointer"
              disabled={classes.length === 0}
            >
              {classes.length === 0 ? (
                <option value="">No courses available</option>
              ) : (
                classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.code} - {cls.name} ({cls.instructor})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Selected Class capacity status visualization */}
          {activeClass && (
            <div className="mb-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/30 shrink-0">
              <div className="flex justify-between items-center mb-1.5 text-xs font-black text-indigo-950">
                <span>Class Occupancy Threshold</span>
                <span className="font-mono">{activeClass.assignedCount} / {activeClass.capacity} allocated</span>
              </div>
              
              {/* Capacity progress bar */}
              <div className="w-full h-2 bg-indigo-100/50 rounded-full overflow-hidden border border-white">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeClass.assignedCount >= activeClass.capacity * 0.9 
                      ? 'bg-rose-500' 
                      : activeClass.assignedCount >= activeClass.capacity * 0.7 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (activeClass.assignedCount / activeClass.capacity) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-2.5 text-[10px] font-medium text-gray-400">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive Live Seat Mapping</span>
                </span>
                <span>Max: {activeClass.capacity}</span>
              </div>
            </div>
          )}

          {/* Assigned roster monitor */}
          <div className="flex-1 flex flex-col min-h-0 text-left">
            <h5 className="text-[10px] font-black text-indigo-950 uppercase tracking-wider mb-2.5 shrink-0">
              New Allocation Draft Roster ({activeClass?.assignedStudents.length || 0})
            </h5>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence initial={false}>
                {activeClass && activeClass.assignedStudents.length > 0 ? (
                  activeClass.assignedStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-2.5 bg-emerald-50/40 border border-emerald-200/40 rounded-xl"
                    >
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-indigo-950">{student.name}</p>
                        <p className="text-[9px] text-gray-400 font-mono mt-0.5">{student.id} • {student.program}</p>
                      </div>

                      <button
                        onClick={() => handleRemoveAssignment(student.id)}
                        className="text-[10px] font-black text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/50 px-2 py-1 rounded-lg transition-all cursor-pointer"
                        title="Remove student allocation"
                      >
                        Release
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-16 text-center text-gray-400 font-bold flex flex-col items-center justify-center gap-2">
                    <Database className="w-8 h-8 text-indigo-200" />
                    <span className="text-xs">No active allocation drafts staged.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
