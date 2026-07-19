import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  User, 
  HelpCircle, 
  LogOut, 
  Sparkles, 
  X,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

interface FacultySidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Teaching Schedule', icon: CalendarDays },
    { id: 'grading', label: 'Grading Hub', icon: GraduationCap },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-left">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3 mb-10 pt-2 px-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(79,70,229,0.35)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h1 className="font-display text-base font-extrabold text-indigo-950 tracking-tight leading-none">
            Elevate Edu
          </h1>
          <p className="text-[9px] text-indigo-600 uppercase tracking-widest font-black mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-500" />
            <span>Faculty Domain</span>
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id || (item.id === 'grading' && currentTab.startsWith('grading-'));
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl font-bold transition-all duration-300 outline-none cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_6px_20px_rgba(79,70,229,0.2)]'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-white/65'
              }`}
            >
              <IconComponent 
                className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'
                }`} 
              />
              <span className="text-xs tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with Help & Logout */}
      <div className="mt-auto pt-6 border-t border-indigo-100/40 space-y-1.5">
        <button
          onClick={() => handleTabClick('support')}
          className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl font-bold text-gray-600 hover:text-indigo-600 hover:bg-white/65 transition-all duration-200 cursor-pointer ${
            currentTab === 'support' ? 'bg-white/85 text-indigo-600 font-extrabold' : ''
          }`}
        >
          <HelpCircle className="w-4.5 h-4.5 text-gray-400" />
          <span className="text-xs tracking-wide">Support Center</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl font-bold text-gray-600 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="w-4.5 h-4.5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
          <span className="text-xs tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <nav className="hidden md:flex flex-col w-64 glass-panel rounded-3xl p-6 h-full shadow-[4px_0_24px_0_rgba(79,70,229,0.03)] border border-white/50 relative overflow-hidden shrink-0">
        <SidebarContent />
      </nav>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <nav className="relative flex flex-col w-72 max-w-[80vw] h-full p-6 bg-white/90 backdrop-blur-2xl shadow-2xl border-r border-white/60 z-10 animate-in slide-in-from-left duration-300">
            {/* Close Toggle */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-indigo-50 text-indigo-950 hover:bg-indigo-100 transition-colors cursor-pointer"
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
