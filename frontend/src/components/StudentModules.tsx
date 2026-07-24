import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  BookOpen, 
  AlertTriangle, 
  CheckCircle,
  Sparkles,
  Info,
  RefreshCw,
  Calendar,
  User,
  Clock,
  ExternalLink,
  X,
  FileText
} from 'lucide-react';
import { GlassEmptyState } from './GlassEmptyState';
import { GlassPanel } from './ui/GlassPanel';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const StudentModules: React.FC = () => {
  const { enrollments, courses, students, refreshData } = useAppStore();
  const user = useAuthStore(state => state.user);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  // Tim thong tin sinh vien trong store khop email hoac ID
  const studentInfo = students.find(s => 
    s.email?.toLowerCase() === user?.email?.toLowerCase() || 
    s.id === user?.id || 
    s.userId === user?.id
  );

  const studentKey = studentInfo?.id || user?.id;

  // Lay danh sach cac mon sinh vien da dang ky thuc te tu CSDL
  const myEnrollments = enrollments.filter(e => e.studentId === studentKey || e.studentId === user?.id);
  const subjects = myEnrollments
    .map(e => {
      const c = courses.find(c => c.id === e.courseId || c.code === e.courseId);
      if (!c) return null;
      return {
        id: c.id,
        code: c.code,
        name: c.name,
        instructor: c.instructor || 'Prof. Academic',
        credits: c.credits || 3,
        department: c.departmentId || 'Computer Science',
        schedule: c.schedule || 'TTH 09:00 - 10:30',
        totalSessions: 16,
        absences: 0
      };
    })
    .filter(Boolean) as any[];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Semester Tracking
          </span>
          <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Current Semester Modules</h3>
          <p className="text-xs text-gray-500 mt-1">Detailed evaluation metrics, credit allocation, and session absence tracking.</p>
        </div>

        <Button 
          variant="secondary" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Modules'}</span>
        </Button>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const absenceRate = (sub.absences / sub.totalSessions) * 100;
            const isWarning = absenceRate >= 20;
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (absenceRate / 100) * circumference;

            return (
              <GlassPanel 
                key={sub.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between min-h-[300px] p-6 ${
                  isWarning 
                    ? 'border-red-300 bg-gradient-to-b from-red-50/10 to-red-100/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.25)] shadow-red-200/50' 
                    : 'border-white/60 bg-white/60 shadow-[0_12px_40px_rgba(79,70,229,0.03)]'
                }`}
              >
                {isWarning && (
                  <div className="absolute inset-0 bg-red-500/5 pointer-events-none select-none animate-pulse" />
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <Badge variant={isWarning ? 'error' : 'success'}>
                      {isWarning ? 'At Risk' : 'In Compliance'}
                    </Badge>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {sub.code} • {sub.credits} Credits
                  </span>

                  <h4 className="font-display text-base font-extrabold text-indigo-950 leading-snug tracking-tight mt-2 mb-1">
                    {sub.name}
                  </h4>

                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{sub.instructor}</span>
                  </p>

                  <div className="flex gap-4 items-center mt-3 bg-white/40 p-3 rounded-2xl border border-indigo-50/50">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          className="stroke-gray-100 fill-none"
                          strokeWidth="6"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          className={`fill-none transition-all duration-700 ${
                            isWarning ? 'stroke-red-500' : 'stroke-indigo-600'
                          }`}
                          strokeWidth="6"
                          strokeDasharray={2 * Math.PI * 34}
                          strokeDashoffset={2 * Math.PI * 34 - (absenceRate / 100) * 2 * Math.PI * 34}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className={`text-sm font-black ${
                          isWarning ? 'text-red-600' : 'text-indigo-950'
                        }`}>
                          {Math.round(absenceRate)}%
                        </span>
                        <span className="text-[7px] text-gray-400 uppercase tracking-widest font-bold">
                          Absent
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Session Logs</p>
                      <p className="font-extrabold text-indigo-950">
                        {sub.absences} Missed Blocks
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        Schedule: <span className="font-bold text-indigo-600">{sub.schedule}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>80% Threshold Met</span>
                  </div>

                  <button 
                    onClick={() => setSelectedModule(sub)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      ) : (
        <GlassPanel className="p-8 text-center flex flex-col items-center justify-center">
          <GlassEmptyState
            title="No Registered Modules"
            description="There are currently no active academic modules or course structures allocated to your profile for the current term."
          />
          <Button variant="primary" onClick={handleRefresh} className="mt-4 cursor-pointer">
            <RefreshCw className="w-4 h-4" />
            <span>Check Database Sync</span>
          </Button>
        </GlassPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <GlassPanel className="p-5 text-left">
          <div className="flex gap-2 items-center text-sm font-bold text-indigo-950 mb-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Attendance Requirements & Rules</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Students are expected to maintain at least <strong>80% attendance</strong> across all modules in order to qualify for the final examinations. Missing more than 20% of sessions in any single subject without a submitted and approved Recovery Request will trigger an automatic academic hold for that subject.
          </p>
        </GlassPanel>

        <GlassPanel className="p-5 text-left">
          <div className="flex gap-2 items-center text-sm font-bold text-indigo-950 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Recovery Approval Criteria</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Approved justifications include documented illness (medical certs), official family emergency, or university-related team travel. Direct photo/document uploads must be submitted within <strong>5 business days</strong> of the missed session block.
          </p>
        </GlassPanel>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-indigo-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-indigo-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {selectedModule.code}
                  </span>
                  <h4 className="text-lg font-bold text-indigo-950 mt-1">{selectedModule.name}</h4>
                </div>
              </div>
              <button 
                onClick={() => setSelectedModule(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Instructor</p>
                  <p className="font-extrabold text-indigo-950 mt-0.5">{selectedModule.instructor}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Credits</p>
                  <p className="font-extrabold text-indigo-950 mt-0.5">{selectedModule.credits} Credit Hours</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Class Schedule</p>
                  <p className="font-extrabold text-indigo-950 mt-0.5">{selectedModule.schedule}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Department</p>
                  <p className="font-extrabold text-indigo-950 mt-0.5">{selectedModule.department}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-indigo-950 mb-2">Grading Weight Distribution</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Assignment &amp; Homework</span>
                    <span className="font-bold text-indigo-950">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Mid-term Examination</span>
                    <span className="font-bold text-indigo-950">30%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 font-medium">Final Examination</span>
                    <span className="font-bold text-indigo-950">40%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-50 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedModule(null)} className="cursor-pointer">
                Close Syllabus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

