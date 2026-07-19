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
import { SmartAlertBanner } from './SmartAlertBanner';
import { GlassEmptyState } from './GlassEmptyState';

interface StudentDashboardProps {
  user: UserProfile;
  searchQuery: string;
  onNavigateTab: (tabId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigateTab
}) => {
  // Static beautiful institutional announcements list - cleared as requested
  const announcements: any[] = [];

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500">
      
      {/* Dynamic Smart Alert Banner at the absolute top */}
      <SmartAlertBanner onNavigateToModules={() => onNavigateTab('modules')} />

      {/* 1. Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl min-h-[220px] bg-gradient-to-br from-indigo-600/10 via-indigo-400/5 to-cyan-400/10 border border-white/60 p-6 md:p-8 flex items-center shadow-sm">
        {/* Decorative vectors */}
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 text-indigo-100 opacity-40 pointer-events-none select-none hidden md:block animate-float-slow">
          <GraduationCap className="w-48 h-48" strokeWidth={0.5} />
        </div>
        <div className="absolute right-40 bottom-4 text-cyan-200/40 pointer-events-none select-none hidden lg:block animate-float-slower">
          <BookMarked className="w-28 h-28" strokeWidth={0.8} />
        </div>

        {/* Banner Copy */}
        <div className="relative z-10 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-indigo-600 text-xs font-bold mb-4 backdrop-blur-md border border-white/50">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fall 2024 Academic Semester</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-950 mb-3 leading-tight">
            Welcome back, {user.name}!
          </h3>
          <p className="text-sm text-indigo-900/75 mb-6 max-w-md">
            Your academic statistics, course calendars, and semester modules are compiled in real-time. Stay on top of your attendance compliance and track your progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigateTab('modules')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(79,70,229,0.15)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Track Current Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigateTab('records')}
              className="bg-white/80 hover:bg-white text-indigo-950 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>View Transcripts</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Academic Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* GPA Box */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Cumulative GPA</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold text-indigo-950">
            {user.gpa?.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <span>+0.05</span>
            <span className="text-gray-400 font-normal">vs. last semester</span>
          </div>
        </div>

        {/* Credits completed */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Accumulated Credits</span>
            <span className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold text-indigo-950">
            {user.creditsCompleted}
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-2">
            Requires <span className="font-bold text-indigo-600">{((user.totalCreditsNeeded ?? 140) - (user.creditsCompleted ?? 124))} credits</span> to graduate (Target: 140)
          </div>
        </div>

        {/* Next class card */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden group sm:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow text-left">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">Next Lecture Block</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="font-display text-base font-bold text-gray-400 italic">
            No Lectures Today
          </div>
          <div className="text-[11px] text-gray-500 mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-400 font-bold">
              <span>All clear</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 mt-0.5">
              <span>No upcoming lecture sessions found.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Modern Institutional Announcements list */}
      <section className="glass-panel rounded-3xl p-6 shadow-sm border border-white/50 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50 mb-5">
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="font-display text-sm font-bold text-indigo-950">Campus Announcements</h4>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full">
            {announcements.length} updates
          </span>
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
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ann.important 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {ann.category}
                    </span>
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

                <button 
                  className="self-start md:self-center text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-0.5 whitespace-nowrap cursor-pointer hover:underline"
                >
                  <span>Read document</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <GlassEmptyState
              title="No Campus Announcements"
              description="There are currently no active campus bulletins or academic announcements published by the administration."
            />
          )}
        </div>
      </section>

    </div>
  );
};
