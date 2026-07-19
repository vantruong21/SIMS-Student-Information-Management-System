import React, { useState } from 'react';
import { FacultySidebar } from './FacultySidebar';
import { FacultyHeader } from './FacultyHeader';
import { FacultyDashboard } from './FacultyDashboard';
import { FacultyAttendance } from './FacultyAttendance';
import { FacultyGrading } from './FacultyGrading';
import { FacultySchedule } from './FacultySchedule';
import { UserProfile, Course } from '../../types';
import { HelpCircle, User, Mail, ShieldAlert, Award, CalendarDays, BookOpen, Clock, Sparkles } from 'lucide-react';

interface FacultyLayoutProps {
  user: UserProfile;
  courses: Course[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FacultyLayout: React.FC<FacultyLayoutProps> = ({
  user,
  courses,
  searchQuery,
  setSearchQuery
}) => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // State for attendance execution (activated by dashboard timeline slot selection)
  const [activeSlot, setActiveSlot] = useState<{ id: string; name: string } | null>(null);

  const handleSelectSlot = (slotId: string, slotName: string) => {
    setActiveSlot({ id: slotId, name: slotName });
    setCurrentTab('dashboard');
  };

  const handleBackToDashboard = () => {
    setActiveSlot(null);
  };

  // Switch tabs and reset active slot
  const handleSetTab = (tabId: string) => {
    setCurrentTab(tabId);
    setActiveSlot(null); // Return to standard tabs
  };

  const renderActiveContent = () => {
    switch (currentTab) {
      case 'dashboard':
        if (activeSlot) {
          return (
            <FacultyAttendance 
              slotId={activeSlot.id} 
              slotName={activeSlot.name} 
              onBackToDashboard={handleBackToDashboard} 
            />
          );
        }
        return (
          <FacultyDashboard 
            user={user} 
            courses={courses} 
            onSelectSlot={handleSelectSlot} 
            onNavigateTab={handleSetTab}
          />
        );
      case 'schedule':
        return (
          <FacultySchedule 
            courses={courses}
            onSelectSlot={handleSelectSlot}
          />
        );
      case 'grading':
        return <FacultyGrading />;
      case 'profile':
        return (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
            <div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                My Profile
              </span>
              <h3 className="font-display text-lg font-extrabold text-indigo-950 mt-1.5">Faculty Lead Profile</h3>
              <p className="text-xs text-gray-500 mt-1">Manage physical identity, contact details, and institutional credentials.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-white/50 border border-white">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <h4 className="text-lg font-black text-indigo-950">{user.name}</h4>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                    Faculty Tenured
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 font-medium">
                  Senior Lecturer of Natural Sciences & Computer Engineering
                </p>

                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1.5 pt-2 text-[11px] text-gray-400 font-bold font-mono">
                  <span className="flex items-center justify-center md:justify-start gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    {user.email || 'faculty.lead@elevate.edu'}
                  </span>
                  <span className="flex items-center justify-center md:justify-start gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                    Access Role: {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile additional metadata blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/40 border border-white text-left space-y-2">
                <h5 className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>Research Domain</span>
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  Multi-variable Numerical Systems, Advanced Topology Optimization, and Applied Machine Interaction.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/40 border border-white text-left space-y-2">
                <h5 className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-indigo-500" />
                  <span>Advisory Office Hours</span>
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  Tuesday / Thursday: 1:00 PM - 3:00 PM at Natural Sciences Building Office 402B.
                </p>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-left animate-in fade-in duration-500">
            <div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Support
              </span>
              <h3 className="font-display text-lg font-extrabold text-indigo-950 mt-1.5">Faculty Administration Support</h3>
              <p className="text-xs text-gray-500 mt-1">Get immediate assistance with technical and classroom facilities.</p>
            </div>
            
            <p className="text-xs text-gray-600 leading-normal font-semibold">
              For immediate assistance with lecture room AV systems, booking additional tutoring labs, rescheduling exams, or requesting dean signature credentials, please reach out to the Staff Support Office.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/50 border border-white">
                <h4 className="text-xs font-black text-indigo-950 mb-1">Classroom AV Helpdesk</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Direct hotline to the technical team for quick projector, audio, or lighting adjustments in large halls.</p>
                <p className="text-[11px] text-indigo-600 font-bold font-mono mt-2">Hotline: Ext 4021</p>
              </div>
              <div className="p-4 rounded-xl bg-white/50 border border-white">
                <h4 className="text-xs font-black text-indigo-950 mb-1">Office of the Registrar</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">Assistance with official credit registrations, double-blind grading standards auditing, and grade lock override.</p>
                <p className="text-[11px] text-indigo-600 font-bold font-mono mt-2">registrar@elevate.edu</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 flex-1 w-full relative min-h-[75vh]">
      {/* 1. Sidebar */}
      <FacultySidebar 
        currentTab={currentTab} 
        setCurrentTab={handleSetTab} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col gap-5 min-w-0">
        <FacultyHeader 
          user={user} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onMenuToggle={() => setIsMobileOpen(true)} 
        />
        
        <main className="flex-1">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  );
};
