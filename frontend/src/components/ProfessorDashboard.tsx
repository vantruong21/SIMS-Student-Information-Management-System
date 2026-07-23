import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckSquare, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2
} from 'lucide-react';
import { Course, UserProfile } from '../types';
import { FacultyRecoveryInbox } from './FacultyRecoveryInbox';
import { GlassEmptyState } from './GlassEmptyState';

interface ProfessorDashboardProps {
  user: UserProfile;
  courses: Course[];
  searchQuery: string;
}

export const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({
  user,
  courses,
  searchQuery
}) => {
  // Pending grades data for the professor to grade - cleared as requested
  const [pendingGrades, setPendingGrades] = useState<any[]>([]);

  // Handle grading input
  const [gradingScore, setGradingScore] = useState<Record<string, string>>({});
  const [activeGradingId, setActiveGradingId] = useState<string | null>(null);

  const handleGradeSubmit = (id: string) => {
    const score = gradingScore[id];
    if (!score) return;

    // Remove from pending list
    setPendingGrades(prev => prev.filter(g => g.id !== id));
    setActiveGradingId(null);
  };

  // Filter pending grades based on search query
  const filteredGrades = pendingGrades.filter(grade => 
    grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.assignment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      
      {/* Three stat cards on top */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Lectures Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div className="font-display text-4xl font-extrabold text-indigo-950">
            {courses.length}
          </div>
          <p className="text-xs text-gray-500 mt-2 font-semibold">Active Lectures</p>
        </div>

        {/* Total Students Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="font-display text-4xl font-extrabold text-indigo-950">
            0
          </div>
          <p className="text-xs text-gray-500 mt-2 font-semibold">Allocated Scholars</p>
        </div>

        {/* Grading Progress Card with radial loader layout */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-display text-4xl font-extrabold text-indigo-950">
              100%
            </div>
            <p className="text-xs text-gray-500 font-semibold">Evaluation Completion</p>
          </div>
          
          {/* Circular SVG loader design */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(240, 236, 249, 1)"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#06b6d4"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={0}
                strokeLinecap="round"
              />
            </svg>
            <CheckSquare className="w-4 h-4 text-cyan-500 absolute" />
          </div>
        </div>
      </section>

      {/* Main Grid: Pending grades queue */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Course Schedule overview for professor */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/50 h-fit space-y-4">
          <div className="pb-2 border-b border-indigo-100/60">
            <h4 className="font-display text-sm font-bold text-indigo-950">Today's Teaching Schedule</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Assigned academic lecture slots for Friday</p>
          </div>

          <div className="space-y-3">
            {courses.length > 0 ? (
              courses.map((course, idx) => (
                <div key={course.id} className="p-3.5 rounded-2xl bg-white/70 border border-white hover:border-indigo-200 transition-all text-left relative overflow-hidden">
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${idx % 2 === 0 ? 'bg-indigo-600' : 'bg-cyan-500'}`} />
                  <p className="text-xs font-bold text-indigo-950 truncate">{course.name} ({course.code})</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>09:00 AM - 11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Academic Block A, Room {101 + idx}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 flex flex-col items-center justify-center">
                <Clock className="w-8 h-8 text-indigo-100 mb-1" />
                <span className="text-xs font-bold">No lectures scheduled today</span>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Pending Grades grading queue */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 shadow-sm border border-white/50 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-indigo-100/60 text-left">
            <div>
              <h4 className="font-display text-sm font-bold text-indigo-950">Evaluation & Approvals</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">List of student assignments and exams pending official scoring.</p>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2.5 py-0.5 rounded-full border border-amber-100">
              {pendingGrades.length} tasks pending review
            </span>
          </div>

          <div className="space-y-3">
            {filteredGrades.length > 0 ? (
              filteredGrades.map((grade) => (
                <div 
                  key={grade.id} 
                  className="p-4 rounded-2xl bg-white/60 border border-white hover:bg-white hover:shadow-sm transition-all text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
                >
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-950">{grade.studentName}</span>
                      <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {grade.courseName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">{grade.assignment}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Submitted: {grade.submittedAt}</p>
                  </div>

                  <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                    {activeGradingId === grade.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                        <select 
                          value={gradingScore[grade.id] || ''} 
                          onChange={(e) => setGradingScore(prev => ({ ...prev, [grade.id]: e.target.value }))}
                          className="px-2 py-1 text-xs rounded-xl border border-indigo-100 bg-white outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                        >
                          <option value="">Select Score</option>
                          <option value="A">A (Excellent - 4.0)</option>
                          <option value="A-">A- (3.7)</option>
                          <option value="B+">B+ (3.3)</option>
                          <option value="B">B (Good - 3.0)</option>
                          <option value="C">C (Pass - 2.0)</option>
                        </select>
                        <button 
                          onClick={() => handleGradeSubmit(grade.id)}
                          disabled={!gradingScore[grade.id]}
                          className="px-3 py-1 bg-indigo-600 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setActiveGradingId(null)}
                          className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveGradingId(grade.id)}
                        className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Evaluate Submission</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-200 mb-2 animate-bounce" strokeWidth={1} />
                <span className="text-xs font-bold text-gray-400">All submissions graded!</span>
                <p className="text-[10px] text-gray-400 mt-0.5">Your evaluation queue is fully completed.</p>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* Attendance & Recovery Workflow Section */}
      <section className="animate-in fade-in duration-500 delay-150 border-t border-indigo-100/30 pt-6">
        <FacultyRecoveryInbox />
      </section>

    </div>
  );
};
