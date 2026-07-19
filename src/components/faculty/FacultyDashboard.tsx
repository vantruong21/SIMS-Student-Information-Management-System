import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckSquare, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  GraduationCap, 
  Play,
  CalendarDays
} from 'lucide-react';
import { Course, UserProfile } from '../../types';

interface FacultyDashboardProps {
  user: UserProfile;
  courses: Course[];
  onSelectSlot: (slotId: string, slotName: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  user,
  courses,
  onSelectSlot,
  onNavigateTab
}) => {
  // Simulating time parameters for the glowing slots
  const [simulatedTime, setSimulatedTime] = useState<'morning' | 'afternoon' | 'off'>('morning');

  // Define today's teaching slots
  const slots = [
    {
      id: 'slot-1',
      courseName: 'Advanced Calculus',
      courseCode: 'MATH 401',
      time: '10:00 AM - 12:00 PM',
      room: 'Room 302, Natural Sciences Building',
      instructor: user.name,
      isActive: simulatedTime === 'morning',
      hours: { start: 10, end: 12 }
    },
    {
      id: 'slot-2',
      courseName: 'Application Development',
      courseCode: 'CS 101',
      time: '02:00 PM - 04:00 PM',
      room: 'IT Lab 102, Computer Building',
      instructor: user.name,
      isActive: simulatedTime === 'afternoon',
      hours: { start: 14, end: 16 }
    }
  ];

  // Active stats
  const totalClasses = 3;
  const totalStudents = 128;
  const gradingProgress = 80;

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      
      {/* 1. Hero Banner Panel */}
      <section className="relative overflow-hidden rounded-3xl min-h-[200px] bg-gradient-to-br from-indigo-600/10 via-indigo-500/5 to-cyan-500/10 border border-white/60 p-6 md:p-8 flex items-center shadow-sm">
        {/* Decorative vectors */}
        <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 text-indigo-100 opacity-40 pointer-events-none select-none hidden md:block animate-float-slow">
          <GraduationCap className="w-44 h-44" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 text-indigo-600 text-xs font-extrabold mb-4 backdrop-blur-md border border-white/50">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active Semester: Fall 2024</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-950 mb-2 leading-tight">
            Elevate Faculty Portal
          </h3>
          <p className="text-xs sm:text-sm text-indigo-900/75 mb-5 max-w-md">
            Manage your daily schedule-driven attendance, submit midterm milestones, and verify student absence justifications from a unified workstation.
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigateTab('grading')}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-[0_8px_16px_rgba(79,70,229,0.15)] hover:shadow-[0_12px_24px_rgba(79,70,229,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Access Grading Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Interactive Time Simulation Control Bar */}
      <section className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Interactive Lecture Hour Simulator</span>
          </h4>
          <p className="text-[10px] text-gray-500 mt-1 leading-normal font-medium">
            Toggle the simulated current time block to trigger dynamic active status glows and schedule transitions in the timeline below.
          </p>
        </div>

        {/* Simulator controls */}
        <div className="flex rounded-xl bg-gray-100 p-1 border border-gray-200 shrink-0">
          <button
            onClick={() => setSimulatedTime('morning')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              simulatedTime === 'morning'
                ? 'bg-white text-indigo-600 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            10:30 AM (Slot 1 Active)
          </button>
          <button
            onClick={() => setSimulatedTime('afternoon')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              simulatedTime === 'afternoon'
                ? 'bg-white text-indigo-600 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            03:00 PM (Slot 2 Active)
          </button>
          <button
            onClick={() => setSimulatedTime('off')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              simulatedTime === 'off'
                ? 'bg-white text-indigo-600 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            After Hours
          </button>
        </div>
      </section>

      {/* 3. Stat Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Classes Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/3 translate-x-1/3 group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4">
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div className="font-display text-4xl font-extrabold text-indigo-950">
            {totalClasses}
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider text-[10px]">Total Courses Managed</p>
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
            {totalStudents}
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider text-[10px]">Assigned Scholars</p>
        </div>

        {/* Evaluation Completion Radial Progress */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-display text-4xl font-extrabold text-indigo-950">
              {gradingProgress}%
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider text-[10px]">Evaluation Completion</p>
          </div>
          
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="rgba(240, 236, 249, 0.8)"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#6366f1"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - gradingProgress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <CheckSquare className="w-4 h-4 text-indigo-500 absolute" />
          </div>
        </div>
      </section>

      {/* 4. Today's Timeline Widget */}
      <section className="glass-panel rounded-3xl p-6 border border-white/50 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-50 mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            <h4 className="font-display text-sm font-bold text-indigo-950">Today's Teaching Timeline</h4>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
            FRIDAY SCHEDULE BLOCK
          </span>
        </div>

        <div className="relative border-l border-indigo-100/70 ml-4 space-y-6">
          {slots.map((slot, index) => (
            <div key={slot.id} className="relative pl-8 group">
              {/* Timeline dot / active glowing orb */}
              {slot.isActive ? (
                <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-white shadow-[0_0_12px_rgba(79,70,229,0.7)] animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              ) : (
                <div className="absolute -left-[7px] top-2.5 w-3.5 h-3.5 rounded-full bg-gray-200 border-2 border-white transition-all group-hover:bg-indigo-300" />
              )}

              {/* Class Card */}
              <div 
                onClick={() => onSelectSlot(slot.id, slot.courseName)}
                className={`p-5 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden border text-left ${
                  slot.isActive 
                    ? 'border-indigo-300 bg-white shadow-[0_12px_24px_rgba(79,70,229,0.06)] hover:shadow-[0_16px_32px_rgba(79,70,229,0.1)] ring-2 ring-indigo-500/10'
                    : 'border-white/50 bg-white/40 hover:bg-white/80 hover:border-indigo-100'
                }`}
              >
                {/* Active pulsating background glow ring */}
                {slot.isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 select-none pointer-events-none animate-pulse" />
                )}

                <div className="space-y-1 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border ${
                      slot.isActive 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : 'bg-gray-50 text-gray-500 border-gray-200/60'
                    }`}>
                      {slot.courseCode}
                    </span>
                    {slot.isActive && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ACTIVE LECTURE HOUR
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-extrabold text-indigo-950 mt-1 leading-snug">
                    {slot.courseName}
                  </h5>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-2 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-indigo-600/80">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {slot.room}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 z-10 w-full sm:w-auto text-right">
                  {slot.isActive ? (
                    <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 hover:translate-x-0.5">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Take Attendance</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-600 transition-colors flex items-center justify-center sm:justify-end gap-1">
                      <span>View Slot Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
