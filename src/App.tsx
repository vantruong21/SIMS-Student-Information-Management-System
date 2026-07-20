import React, { useState, useEffect } from 'react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentModules } from './components/StudentModules';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminCourseManagement } from './components/admin/AdminCourseManagement';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { WeeklySchedule } from './components/WeeklySchedule';
import { UserProfile } from './components/UserProfile';
import { StudentRecords } from './components/StudentRecords';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';
import { FacultyLayout } from './components/faculty/FacultyLayout';
import { ScheduleEvent } from './types';
import { SkipLink } from './components/common/Accessibility';
import { ToastProvider } from './contexts/ToastContext';
import { NetworkErrorBoundary } from './components/NetworkErrorBoundary';

/**
 * App — Root Application Component
 * 
 * ARCHITECTURE: Acts as the top-level router/layout coordinator.
 * DATA FLOW: AppFacade → Zustand Stores → React Components
 * ACCESSIBILITY: Skip link, semantic landmarks, session management.
 */
export default function App() {
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const checkSession = useAuthStore((state) => state.checkSession);
  const { initialize, isInitialized } = useAppStore();

  // Initialize app data (seed CSV repositories)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Session timeout checker (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        checkSession();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser, checkSession]);

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const students = useAppStore(state => state.students);
  const courses = useAppStore(state => state.courses);
  const enrollments = useAppStore(state => state.enrollments);
  const user = useAuthStore(state => state.user);
  
  const schedule = courses
    .filter(c => enrollments.some(e => e.courseId === c.id && e.studentId === user?.id))
    .map((c, idx) => {
       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
       return {
         id: `evt-${idx}`,
         courseName: c.name,
         courseCode: c.code,
         day: days[idx % days.length] as ScheduleEvent['day'],
         time: '09:00 AM - 10:30 AM',
         room: 'Room ' + (100 + idx),
         instructor: c.instructor
       }
    });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    setCurrentTab('dashboard');
    setSearchQuery('');
  };

  // Render main tab content depending on role and selection
  const renderTabContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'Student') {
      switch (currentTab) {
        case 'dashboard':
          return (
            <StudentDashboard 
              user={currentUser} 
              searchQuery={searchQuery}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          );
        case 'modules':
          return <StudentModules />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateProfile={async (data) => {
            const success = await useAppStore.getState().updateUserProfile(currentUser.email, data);
            if (success) {
              const updated = useAppStore.getState().students.find(s => s.email === currentUser.email);
              if (updated) setUser({ ...currentUser, phone: updated.phone });
            }
          }} />;
        case 'schedule':
          return <WeeklySchedule schedule={schedule} />;
        case 'records':
          return <StudentRecords courses={courses} />;
        case 'support':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left">
              <div>
                <h3 className="font-display text-lg font-bold text-indigo-950">Elevate Edu Academic Support Hub</h3>
                <p className="text-xs text-gray-500 mt-1">Get in touch with administrative or IT support staff for term issues.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/50 border border-white text-left">
                  <h4 className="font-bold text-sm text-indigo-950 mb-1">Academic Affairs Office</h4>
                  <p className="text-xs text-gray-600 leading-normal">Contact Academic Affairs to resolve issues with course registration, graduation credits, or official physical transcript requests.</p>
                  <p className="text-xs text-indigo-600 font-bold mt-3 font-mono">Hotline: +1 (555) 012-4911</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/50 border border-white text-left">
                  <h4 className="font-bold text-sm text-indigo-950 mb-1">IT Systems & Account Support</h4>
                  <p className="text-xs text-gray-600 leading-normal">Tech support for password resets, student email retrieval (@elevate.edu), or online midterms access issues.</p>
                  <p className="text-xs text-indigo-600 font-bold mt-3 font-mono">support@elevate.edu</p>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    } else if (currentUser.role === 'Faculty') {
      switch (currentTab) {
        case 'dashboard':
          return (
            <ProfessorDashboard 
              user={currentUser} 
              courses={courses} 
              searchQuery={searchQuery}
            />
          );
        case 'library':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
              <div>
                <h3 className="font-display text-lg font-bold text-indigo-950">Academic Resource & Syllabus Library</h3>
                <p className="text-xs text-gray-500 mt-1">Central repository for lecturing slide decks, syllabus outlines, and course guides.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: 'Syllabus - Advanced Calculus', size: '2.4 MB', type: 'PDF Document', updated: '3 days ago' },
                  { name: 'Lecture Slides - Week 5: Partial Derivatives', size: '15.8 MB', type: 'Powerpoint PPTX', updated: 'Yesterday' },
                  { name: 'Detailed Solutions - Homework Week 4', size: '1.1 MB', type: 'PDF Document', updated: '5 days ago' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/60 border border-white hover:bg-white transition-all text-left flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                        {doc.type}
                      </span>
                      <h4 className="text-xs font-bold text-indigo-950 mt-2 line-clamp-2">{doc.name}</h4>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>{doc.size}</span>
                      <span>{doc.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'analytics':
          return <DashboardAnalytics user={currentUser} />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateProfile={async (data) => {
            const success = await useAppStore.getState().updateUserProfile(currentUser.email, data);
            if (success) {
              const updated = useAppStore.getState().faculty.find(f => f.email === currentUser.email);
              if (updated) setUser({ ...currentUser, phone: updated.phone });
            }
          }} />;
        case 'settings':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
              <div>
                <h3 className="font-display text-lg font-bold text-indigo-950">Evaluation & Lecture Calibration</h3>
                <p className="text-xs text-gray-500 mt-1">Configure grading distributions and assessment standards for allocated courses.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/40 border border-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-indigo-950">Automated Proximity Attendance</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Syllabus automatically flags attendance when student registers inside the lecture block via QR scan.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-indigo-50">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-indigo-950">Double-Blind Anonymous Evaluation</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Anonymize scholar identities when reviewing final research manuscripts.</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 cursor-pointer" />
                </div>
              </div>
            </div>
          );
        case 'support':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-left animate-in fade-in duration-500">
              <h3 className="font-display text-lg font-bold text-indigo-950">Faculty Administration & Staff Support</h3>
              <p className="text-xs text-gray-600 leading-normal">
                For immediate assistance with AV projectors, scheduling makeup lectures, or reserving scientific seminars, please contact the Main Academic Office directly.
              </p>
            </div>
          );
        default:
          return null;
      }
    } else {
      // Administrator tabs
      switch (currentTab) {
        case 'dashboard':
        case 'students':
        case 'allocation':
        case 'courses':
        case 'departments':
          return (
            <AdminDashboard 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentTab={currentTab}
              courses={courses}
            />
          );
        case 'analytics':
          return <DashboardAnalytics user={currentUser} />;
        case 'profile':
          return <UserProfile user={currentUser} onUpdateProfile={async (data) => {
            const success = await useAppStore.getState().updateUserProfile(currentUser.email, data);
            if (success) {
              const updated = useAppStore.getState().users.find(u => u.email === currentUser.email);
              if (updated) setUser({ ...currentUser, phone: updated.phone });
            }
          }} />;
        case 'settings':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left">
              <div>
                <h3 className="font-display text-lg font-bold text-indigo-950">System Infrastructure Settings</h3>
                <p className="text-xs text-gray-500 mt-1">Adjust portal access boundaries, active semester durations, and system-wide SLAs.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/40 border border-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-indigo-950">Autonomous Pre-Registration</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Allows eligible students to pre-register for courses 2 weeks before semester startup.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-indigo-50">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-indigo-950">Grade-Book Freeze Protocol</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Automatically lock all course grade-books for Fall 2024 after December 15th.</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 cursor-pointer" />
                </div>
              </div>
            </div>
          );
        case 'support':
          return (
            <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 text-left">
              <h3 className="font-display text-lg font-bold text-indigo-950">Enterprise Technical Support Desk</h3>
              <p className="text-xs text-gray-600 leading-normal">
                For Admin accounts, any critical failures involving Spanner replication lag, LDAP synchronization, or cluster faults should be reported directly to Network Operations.
              </p>
            </div>
          );
        default:
          return null;
      }
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-indigo-50/40 via-blue-50/20 to-violet-50/30 font-sans text-indigo-950 flex flex-col items-center justify-center relative overflow-x-hidden p-3 md:p-6 select-none" lang="en">
      {/* ACCESSIBILITY: Skip navigation link */}
      <SkipLink targetId="main-content" />

      {/* Dynamic Fluid Liquid Background Orbs */}
      <BackgroundOrbs />

      {/* Primary Container Box */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 z-10 min-h-[90vh]">
        
        {/* Main Interface Layout Router */}
        {!currentUser ? (
          // LOGIN VIEW
          <div className="flex-1 flex items-center justify-center py-8">
            <LoginScreen />
          </div>
        ) : currentUser.role === 'Faculty' ? (
          // FACULTY MODULAR LAYOUT
          <FacultyLayout
            user={currentUser}
            courses={courses}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          // DASHBOARD PORTAL VIEW (Navbar left, Main right)
          <div className="flex-1 flex flex-col md:flex-row gap-5 items-stretch relative">
            
            {/* Sidebar Navigation Drawer */}
            <Navbar 
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isMobileOpen={isMobileNavOpen}
              setIsMobileOpen={setIsMobileNavOpen}
            />

            {/* Dashboard Workspace panel */}
            <div className="flex-1 flex flex-col gap-5 overflow-visible">
              
              {/* Header on top */}
              <Header 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
              />

              {/* Scrollable Tab Content Container */}
              <main id="main-content" className="flex-1 overflow-visible" role="main" aria-label="Main content area">
                {renderTabContent()}
              </main>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
