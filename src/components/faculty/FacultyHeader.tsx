import React, { useState } from 'react';
import { Bell, Sparkles, Menu, Search, Award } from 'lucide-react';
import { UserProfile } from '../../types';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { ActionDrawer } from './ActionDrawer';
import { AnimatePresence } from 'motion/react';

interface FacultyHeaderProps {
  user: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle?: () => void;
}

export const FacultyHeader: React.FC<FacultyHeaderProps> = ({
  user,
  searchQuery,
  setSearchQuery,
  onMenuToggle
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { requests } = useAttendanceStore();

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  return (
    <>
      <header className="glass-panel backdrop-blur-xl bg-white/50 rounded-2xl md:rounded-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-[0_8px_32px_rgba(79,70,229,0.03)] border border-white/60">
        
        {/* Mobile menu trigger & portal context */}
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button 
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl bg-indigo-50 text-indigo-950 hover:bg-indigo-100 transition-all active:scale-95 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="text-left">
            <h2 className="font-display text-base md:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              Welcome back, Prof. {user.name}!
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
              Portal synchronizer active. You have {pendingRequestsCount} active student requests pending decision.
            </p>
          </div>
        </div>

        {/* Global actions and controls */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Soft Glass Omnibar Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, submissions..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200/60 bg-white/70 focus:bg-white text-xs w-60 shadow-inner outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 placeholder:text-gray-400 font-semibold"
            />
          </div>

          {/* Institutional Academic Semester Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
            <span className="font-display">Fall 2024 Faculty Node</span>
          </div>

          {/* Action-Driven Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-indigo-600 border border-gray-150 shadow-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Toggle action center"
            >
              <Bell className="w-4.5 h-4.5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          </div>

          {/* Faculty Headshot Avatar */}
          <div className="flex items-center gap-2 border-l border-gray-200/80 pl-3 md:pl-4">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white shadow-md hover:scale-105 transition-transform duration-300 shrink-0 cursor-pointer">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-extrabold text-indigo-950 leading-none">{user.name}</p>
              <p className="text-[9px] text-indigo-600 font-black mt-1 uppercase tracking-widest">
                Faculty Lead
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* ActionDrawer rendered under AnimatePresence */}
      <AnimatePresence>
        {isDrawerOpen && (
          <ActionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
