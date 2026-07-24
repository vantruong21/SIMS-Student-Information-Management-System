import React from 'react';
import { 
  Award, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  GraduationCap, 
  BookMarked,
  Bell,
  Clock,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAppStore } from '../store/useAppStore';
import { SmartAlertBanner } from './SmartAlertBanner';
import { GlassEmptyState } from './GlassEmptyState';
import { GlassPanel } from './ui/GlassPanel';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface StudentDashboardProps {
  user: UserProfile;
  searchQuery: string;
  onNavigateTab: (tabId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigateTab
}) => {
  const { enrollments, courses, grades, students } = useAppStore();
  
  // Tim thong tin Sinh vien trong store khop email hoac ID
  const studentInfo = students.find(s => 
    s.email?.toLowerCase() === user.email?.toLowerCase() || 
    s.id === user.id || 
    s.userId === user.id
  );

  const studentKey = studentInfo?.id || user.id;

  // Lấy danh sách Enrollments thực tế từ DB của Sinh viên này
  const myEnrollments = enrollments.filter(e => e.studentId === studentKey || e.studentId === user.id);
  const myCourses = myEnrollments
    .map(e => courses.find(c => c.id === e.courseId || c.code === e.courseId))
    .filter(Boolean) as any[];

  // Tín chỉ đã tích lũy từ các môn đã đăng ký
  const creditsCompleted = myCourses.reduce((acc, c) => acc + (c.credits || 3), 0);

  // Tính điểm GPA thực tế từ các môn học đã có điểm trong DB
  const gradedEnrollments = myEnrollments.filter(e => e.totalGrade !== null && e.totalGrade !== undefined);
  let computedGpa = studentInfo?.gpa ?? user.gpa ?? 0;
  if (gradedEnrollments.length > 0) {
    const totalScore = gradedEnrollments.reduce((sum, e) => sum + Number(e.totalGrade), 0);
    computedGpa = totalScore / gradedEnrollments.length;
  }

  // Môn học tiếp theo (Next Lecture)
  const nextCourse = myCourses.length > 0 ? myCourses[0] : null;

  // Thông báo Campus
  const announcements = [
    {
      id: 'ann-1',
      title: 'Fall 2024 Final Examination Schedule Published',
      category: 'Academic Bulletin',
      time: '2 hours ago',
      text: 'The academic registrar has officially released the exam schedules for all undergraduate programs. Check your student portal.',
      important: true
    },
    {
      id: 'ann-2',
      title: 'Campus Central Library Extension Hours',
      category: 'Facility Notice',
      time: '1 day ago',
      text: 'To support students during mid-term preparations, the central library will remain open 24/7 through next week.',
      important: false
    }
  ];


  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500">
      
      <SmartAlertBanner onNavigateToModules={() => onNavigateTab('modules')} />

      <section className="relative overflow-hidden rounded-3xl min-h-[220px] bg-gradient-to-br from-indigo-600/10 via-indigo-400/5 to-cyan-400/10 border border-white/60 p-6 md:p-8 flex items-center shadow-sm">
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 text-indigo-100 opacity-40 pointer-events-none select-none hidden md:block animate-float-slow">
          <GraduationCap className="w-48 h-48" strokeWidth={0.5} />
        </div>
        <div className="absolute right-40 bottom-4 text-cyan-200/40 pointer-events-none select-none hidden lg:block animate-float-slower">
          <BookMarked className="w-28 h-28" strokeWidth={0.8} />
        </div>

        <div className="relative z-10 max-w-xl text-left">
          <Badge variant="info" icon={Award} className="mb-4 bg-white/60 backdrop-blur-md border border-white/50 px-3 py-1 text-indigo-600">
            Fall 2024 Academic Semester
          </Badge>
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-950 mb-3 leading-tight">
            Welcome back, {user.name}!
          </h3>
          <p className="text-sm text-indigo-900/75 mb-6 max-w-md">
            Your academic statistics, course calendars, and semester modules are compiled in real-time. Stay on top of your attendance compliance and track your progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => onNavigateTab('modules')}>
              <span>Track Current Modules</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="secondary" onClick={() => onNavigateTab('records')}>
              <span>View Transcripts</span>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Cumulative GPA</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold text-indigo-950">
            {computedGpa.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <span>+0.05</span>
            <span className="text-gray-400 font-normal">vs. last semester</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Accumulated Credits</span>
            <span className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold text-indigo-950">
            {creditsCompleted}
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-2">
            Requires <span className="font-bold text-indigo-600">{Math.max(0, 140 - creditsCompleted)} credits</span> to graduate (Target: 140)
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Next Lecture Block</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          {nextCourse ? (
            <div>
              <div className="font-display text-base font-extrabold text-indigo-950 truncate">
                {nextCourse.name} ({nextCourse.code})
              </div>
              <div className="text-[11px] text-indigo-600 font-bold mt-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-indigo-500" />
                <span>{nextCourse.schedule || 'TTH 09:00 - 10:30'}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Instructor: {nextCourse.instructor || 'Prof. Academic'}</p>
            </div>
          ) : (
            <div>
              <div className="font-display text-base font-bold text-gray-400 italic">
                No Active Modules
              </div>
              <div className="text-[11px] text-gray-500 mt-2 flex flex-col gap-1">
                <span className="text-gray-400 font-bold">No enrolled courses</span>
                <button 
                  onClick={() => onNavigateTab('modules')} 
                  className="text-xs text-indigo-600 font-bold hover:underline self-start mt-1 cursor-pointer"
                >
                  + Enroll Modules Now
                </button>
              </div>
            </div>
          )}
        </div>

      </section>

      <GlassPanel className="text-left">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50 mb-5">
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="font-display text-sm font-bold text-indigo-950">Campus Announcements</h4>
          </div>
          <Badge variant="info">
            {announcements.length} updates
          </Badge>
        </div>

        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div 
                key={ann.id}
                className="p-4 rounded-2xl bg-white/40 hover:bg-white/70 border border-white/50 transition-all duration-200 flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.important ? 'error' : 'info'}>
                      {ann.category}
                    </Badge>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ann.time}
                    </span>
                  </div>
                  <h5 className="text-xs font-extrabold text-indigo-950 mt-1">
                    {ann.title}
                  </h5>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                    {ann.text}
                  </p>
                </div>

                <Button variant="ghost" className="self-start md:self-center" onClick={() => {}}>
                  <span>Read document</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <GlassEmptyState
              title="No Campus Announcements"
              description="There are currently no active campus bulletins or academic announcements published by the administration."
            />
          )}
        </div>
      </GlassPanel>

    </div>
  );
};
