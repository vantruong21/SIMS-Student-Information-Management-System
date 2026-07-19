import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuthStore } from '../store/useAuthStore';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  if (!user) return null;

  const isStudent = user.role === 'Student';
  const isFaculty = user.role === 'Faculty';

  const menuItems = isStudent 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'modules', label: 'My Modules', icon: BookOpen },
        { id: 'schedule', label: 'Schedule & Attendance', icon: Calendar },
        { id: 'records', label: 'Academic Records', icon: GraduationCap },
        { id: 'profile', label: 'My Profile', icon: User },
      ]
    : isFaculty 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'library', label: 'Lecture Library', icon: BookOpen },
        { id: 'analytics', label: 'Academic Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Class Settings', icon: Settings },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Student Directory', icon: Users },
        { id: 'allocation', label: 'Smart Allocation', icon: Sparkles },
        { id: 'courses', label: 'Course Assignments', icon: BookOpen },
        { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-10 pt-2 px-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_8px_16px_-4px_rgba(79,70,229,0.4)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h1 className="font-display text-lg font-extrabold text-indigo-950 tracking-tight leading-none">
            Elevate Edu
          </h1>
          <p className="text-[10px] text-indigo-600 uppercase tracking-widest font-bold mt-1.5">
            {isStudent ? 'Student Portal' : isFaculty ? 'Faculty Portal' : 'Admin Portal'}
          </p>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 outline-none cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-white/60'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Nav Footer / Support & Logout */}
      <div className="mt-auto pt-6 border-t border-white/40 space-y-1.5">
        <button
          onClick={() => handleTabClick('support')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:text-indigo-600 hover:bg-white/60 transition-all duration-200 cursor-pointer ${
            currentTab === 'support' ? 'bg-white/80 text-indigo-600 font-bold' : ''
          }`}
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <span className="text-sm">Support Center</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <nav className="hidden md:flex flex-col w-64 glass-panel rounded-3xl p-6 h-full shadow-[4px_0_24px_0_rgba(79,70,229,0.03)] border border-white/50 relative overflow-hidden shrink-0">
        <SidebarContent />
      </nav>

      {/* Mobile Drawer (Overlay) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <nav className="relative flex flex-col w-72 max-w-[80vw] h-full p-6 bg-white/90 backdrop-blur-2xl shadow-2xl border-r border-white/60 z-10 animate-in slide-in-from-left duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-indigo-50 text-indigo-950 hover:bg-indigo-100/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </nav>
        </div>
      )}
    </>
  );
};
