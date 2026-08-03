import React, { useState, useEffect } from 'react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { LoginScreen } from './components/LoginScreen';
import { MainLayout } from './components/layout/MainLayout';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentModules } from './components/StudentModules';
import { StudentRecords } from './components/StudentRecords';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminCourseManagement } from './components/admin/AdminCourseManagement';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { WeeklySchedule } from './components/WeeklySchedule';
import { SystemSettings } from './components/admin/SystemSettings';
import { UserProfile as UserProfileComponent } from './components/UserProfile';
import { useAuthStore } from './store/useAuthStore';
import { useAppStore } from './store/useAppStore';
import { NetworkErrorBoundary } from './components/NetworkErrorBoundary';
import { useNetwork } from './hooks/useNetwork';
import { ToastProvider } from './contexts/ToastContext';
import { SkipLink } from './components/common/Accessibility';

import { AlertCircle, LayoutDashboard, BookOpen, Calendar, GraduationCap, User, BarChart3, Settings, Users, Sparkles, Building2 } from 'lucide-react';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultySchedule } from './components/faculty/FacultySchedule';
import { FacultyGrading } from './components/faculty/FacultyGrading';
import { FacultyAttendance } from './components/faculty/FacultyAttendance';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const checkSession = useAuthStore((state) => state.checkSession);
  const { initialize, isInitialized, updateUserProfile } = useAppStore();
  const isOnline = useNetwork();
  
  const courses = useAppStore(state => state.courses);

  const [activeSlot, setActiveSlot] = useState<{ id: string; name: string } | null>(null);

  // Khi có user (đăng nhập xong) thì gọi initialize để load dữ liệu từ Backend
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (currentUser && !isInitialized) {
      initialize();
    }
  }, [currentUser, isInitialized, initialize]);

  if (currentUser && !isInitialized) return null;

  // Sidebar mapping logic
  const getSidebarItems = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'Student') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'modules', label: 'My Modules', icon: BookOpen },
        { id: 'schedule', label: 'Schedule & Attendance', icon: Calendar },
        { id: 'records', label: 'Academic Records', icon: GraduationCap },
        { id: 'profile', label: 'My Profile', icon: User },
      ];
    }
    if (currentUser.role === 'Faculty') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedule', label: 'My Schedule', icon: Calendar },
        { id: 'grading', label: 'Fast-Entry Grading', icon: BookOpen },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'My Profile', icon: User },
      ];
    }
    // Admin
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Student Directory', icon: Users },
      { id: 'faculty', label: 'Faculty Directory', icon: GraduationCap },
      { id: 'allocation', label: 'Smart Allocation', icon: Sparkles },
      { id: 'courses', label: 'Course Assignments', icon: BookOpen },
      { id: 'departments', label: 'Departments', icon: Building2 },
      { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
      { id: 'settings', label: 'System Settings', icon: Settings },
      { id: 'profile', label: 'My Profile', icon: User },
    ];
  };

  const renderTabContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'Student') {
      switch (currentTab) {
        case 'dashboard': return <StudentDashboard user={currentUser} searchQuery={searchQuery} onNavigateTab={setCurrentTab} />;
        case 'modules': return <StudentModules />;
        case 'schedule': return <WeeklySchedule schedule={[]} />;
        case 'records': return <StudentRecords />;
        case 'profile':
          return <UserProfileComponent user={currentUser} onUpdateProfile={async (data) => {
            await updateUserProfile(currentUser.email, data);
            setUser({
              ...currentUser,
              phone: data.phone ?? currentUser.phone,
              avatarUrl: data.avatarUrl ?? currentUser.avatarUrl,
            });
          }} />;
        default: return null;
      }
    } else if (currentUser.role === 'Faculty') {
      switch (currentTab) {
        case 'dashboard':
          if (activeSlot) {
            return <FacultyAttendance slotId={activeSlot.id} slotName={activeSlot.name} onBackToDashboard={() => setActiveSlot(null)} />;
          }
          return <FacultyDashboard user={currentUser} courses={courses} onSelectSlot={(id, name) => { setActiveSlot({ id, name }); setCurrentTab('dashboard'); }} onNavigateTab={(tab) => { setCurrentTab(tab); setActiveSlot(null); }} />;
        case 'schedule': return <FacultySchedule courses={courses} onSelectSlot={(id, name) => { setActiveSlot({ id, name }); setCurrentTab('dashboard'); }} />;
        case 'grading': return <FacultyGrading />;
        case 'analytics': return <DashboardAnalytics user={currentUser} />;
        case 'profile':
          return <UserProfileComponent user={currentUser} onUpdateProfile={async (data) => {
            await updateUserProfile(currentUser.email, data);
            setUser({
              ...currentUser,
              phone: data.phone ?? currentUser.phone,
              avatarUrl: data.avatarUrl ?? currentUser.avatarUrl,
            });
          }} />;
        default: return null;
      }
    } else {
      // Admin
      switch (currentTab) {
        case 'dashboard':
        case 'students':
        case 'allocation':
        case 'courses':
        case 'departments':
        case 'faculty':
        case 'settings':
          return <AdminDashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} currentTab={currentTab} courses={courses} />;
        case 'analytics': return <DashboardAnalytics user={currentUser} />;

        case 'profile':
          return <UserProfileComponent user={currentUser} onUpdateProfile={async (data) => {
            await updateUserProfile(currentUser.email, data);
            setUser({
              ...currentUser,
              phone: data.phone ?? currentUser.phone,
              avatarUrl: data.avatarUrl ?? currentUser.avatarUrl,
            });
          }} />;
        default: return null;
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-indigo-50/40 via-blue-50/20 to-violet-50/30 font-sans text-indigo-950 flex flex-col items-center justify-center relative overflow-x-hidden p-3 md:p-6 select-none" lang="en">
      <SkipLink targetId="main-content" />
      <BackgroundOrbs />
      
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 z-10 min-h-[90vh]">
        {!isOnline && (
          <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm font-bold text-xs animate-in slide-in-from-top-4">
            <AlertCircle className="w-4 h-4" />
            <span>You are currently offline. Operations will be synced when connection is restored.</span>
          </div>
        )}
        
        {!currentUser ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <LoginScreen />
          </div>
        ) : (
          <MainLayout
            userRole={currentUser.role}
            userName={currentUser.name}
            userAvatar={currentUser.avatarUrl}
            sidebarItems={getSidebarItems()}
            currentTab={currentTab}
            setCurrentTab={(tab) => { setCurrentTab(tab); setActiveSlot(null); }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          >
            {renderTabContent()}
          </MainLayout>
        )}
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <NetworkErrorBoundary>
    <ToastProvider>
      <App />
    </ToastProvider>
  </NetworkErrorBoundary>
);

export default AppWrapper;
