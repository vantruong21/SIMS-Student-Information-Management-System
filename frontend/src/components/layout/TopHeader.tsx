import React, { useState } from 'react';
import { Search, Bell, Menu, Sparkles } from 'lucide-react';
import { SearchInput } from '../ui/SearchInput';
import { Badge } from '../ui/Badge';
import { ActionDrawer } from '../faculty/ActionDrawer';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { GlobalSearchDropdown } from '../ui/GlobalSearchDropdown';

interface TopHeaderProps {
  userRole: 'Student' | 'Faculty' | 'Admin';
  userName: string;
  userAvatar?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userRole,
  userName,
  userAvatar,
  searchQuery,
  setSearchQuery,
  onMenuToggle
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { requests } = useAttendanceStore();

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  // Placeholder logic for subtitle based on role
  const subtitle = userRole === 'Student' 
    ? 'You have 2 lectures and 1 assignment due today.' 
    : userRole === 'Faculty'
    ? `Portal synchronizer active. You have ${pendingRequestsCount} active student requests.`
    : 'System health is optimal. 2 registrations are pending.';

  return (
    <>
      <header className="glass-panel backdrop-blur-xl bg-white/50 rounded-2xl md:rounded-full px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-[0_8px_32px_rgba(79,70,229,0.03)] border border-white/60">
        
        {/* Mobile Menu Trigger & Title */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl bg-indigo-50 text-indigo-950 hover:bg-indigo-100 transition-all active:scale-95 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="font-display text-base md:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              {userRole === 'Faculty' ? `Welcome back, Prof. ${userName}!` : `Welcome back, ${userName}!`}
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Input Bar */}
          <div className="hidden lg:block relative z-50">
            <SearchInput 
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (val.trim()) setIsSearchOpen(true);
                else setIsSearchOpen(false);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchOpen(true);
              }}
              placeholder={
                userRole === 'Student' ? "Search courses, professors..." :
                userRole === 'Faculty' ? "Search students, submissions..." :
                "Search students, classes..."
              }
              className="w-64"
            />
            {isSearchOpen && (
              <GlobalSearchDropdown 
                query={searchQuery} 
                onClose={() => setIsSearchOpen(false)} 
                onSelect={(item) => {
                  console.log("Selected from search:", item);
                  setIsSearchOpen(false);
                }} 
              />
            )}
          </div>

          {/* Dynamic Sparkles Feature Indicator */}
          <div className="hidden sm:flex">
            <Badge variant="info" icon={Sparkles} className="px-3 py-1.5 border border-indigo-100 bg-indigo-50/80 text-indigo-600">
              <span className="font-display ml-1">{userRole === 'Faculty' ? 'Fall 2024 Faculty Node' : 'Fall 2024 Semester'}</span>
            </Badge>
          </div>

          {/* Action-Driven Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="relative p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-indigo-600 border border-gray-200/50 shadow-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Bell className="w-4.5 h-4.5" />
              {userRole === 'Faculty' && pendingRequestsCount > 0 ? (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                  {pendingRequestsCount}
                </span>
              ) : (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                  3
                </span>
              )}
            </button>
            
            {/* Show Notification Dropdown for non-faculty or as a generic bell */}
            {userRole !== 'Faculty' && (
              <NotificationDropdown 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                userRole={userRole} 
              />
            )}
          </div>

          {/* Avatar */}
          {userAvatar && (
            <div className="flex items-center gap-2 border-l border-gray-200/80 pl-3 md:pl-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-white shadow-md hover:scale-105 transition-transform duration-300 shrink-0 cursor-pointer">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-extrabold text-indigo-950 leading-none">{userName}</p>
                <p className="text-[9px] text-indigo-600 font-black mt-1 uppercase tracking-widest">
                  {userRole}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Render ActionDrawer if Faculty (Currently relies on existing ActionDrawer) */}
      {userRole === 'Faculty' && (
        <ActionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}
    </>
  );
};
