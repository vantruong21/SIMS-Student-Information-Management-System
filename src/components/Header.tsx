import React, { useState } from 'react';
import { Search, Bell, Sparkles, Menu, Check, X, Inbox } from 'lucide-react';
import { UserProfile } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useAttendanceStore } from '../store/useAttendanceStore';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onMenuToggle
}) => {
  const user = useAuthStore(state => state.user);
  const { requests, approveRequest, rejectRequest } = useAttendanceStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'recovery'>('notifications');

  if (!user) return null;
  
  // Custom mock notifications depending on role
  const notifications = user.role === 'Student' 
    ? [
        { id: 1, text: 'Your grade for Advanced Calculus has been updated.', time: '10m ago', read: false },
        { id: 2, text: 'Quantum Physics class relocated to Lab 3.', time: '2h ago', read: false },
        { id: 3, text: 'Tuition fees for the upcoming semester have been received.', time: '1d ago', read: true }
      ]
    : user.role === 'Faculty'
    ? [
        { id: 1, text: 'Advanced Calculus assignment from Minh Anh Dang is pending grading.', time: '15m ago', read: false },
        { id: 2, text: 'The Dean approved the General Physics II syllabus.', time: '4h ago', read: false },
        { id: 3, text: 'Faculty senate meeting scheduled for 2:00 PM tomorrow.', time: '1d ago', read: true }
      ]
    : [
        { id: 1, text: 'New student Emily Taylor registered a new account.', time: '5m ago', read: false },
        { id: 2, text: 'Database backup auto-completed successfully.', time: '1h ago', read: false },
        { id: 3, text: '15 academic transcripts are pending dean signature.', time: '3h ago', read: true }
      ];

  const pendingRecoveryCount = user.role === 'Faculty' 
    ? requests.filter(r => r.status === 'Pending').length 
    : 0;

  const unreadCount = notifications.filter(n => !n.read).length + pendingRecoveryCount;

  return (
    <header className="glass-panel backdrop-blur-xl bg-white/50 rounded-2xl md:rounded-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-[0_8px_32px_rgba(79,70,229,0.03)] border border-white/60">
      
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
            {user.role === 'Student' 
              ? `Welcome back, ${user.name}!` 
              : user.role === 'Faculty'
              ? `Welcome back, Prof. ${user.name}!`
              : `Good morning, Admin!`}
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block mt-0.5">
            {user.role === 'Student' 
              ? 'You have 2 lectures and 1 assignment due today.' 
              : user.role === 'Faculty'
              ? 'You have 1 class session and 4 submissions pending review.'
              : 'System health is optimal. 2 registrations are pending.'}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search Input Bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              user.role === 'Student' 
                ? "Search courses, professors..." 
                : user.role === 'Faculty' 
                ? "Search submissions, students..." 
                : "Search students, classes..."
            }
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200/60 bg-white/70 focus:bg-white text-sm w-64 shadow-inner outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 placeholder:text-gray-400"
          />
        </div>

        {/* Dynamic Sparkles Feature Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
          <span className="font-display">Fall 2024 Term</span>
        </div>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-indigo-600 border border-gray-100 shadow-sm transition-all duration-200 cursor-pointer animate-pulse"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {/* Notifications Dropdown Container */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-3 w-88 max-w-[90vw] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-50 p-4 z-50 animate-in fade-in slide-in-from-top-5 duration-200 text-left">
                
                {/* Tab selector for Faculty role */}
                {user.role === 'Faculty' ? (
                  <div className="flex rounded-xl bg-gray-50 p-1 mb-3 border border-gray-150">
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                        activeTab === 'notifications' 
                          ? 'bg-white text-indigo-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Alerts
                    </button>
                    <button
                      onClick={() => setActiveTab('recovery')}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold text-center transition-all relative cursor-pointer ${
                        activeTab === 'recovery' 
                          ? 'bg-white text-indigo-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span>Recoveries</span>
                      {pendingRecoveryCount > 0 && (
                        <span className="ml-1.5 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                          {pendingRecoveryCount}
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <h4 className="font-display font-bold text-gray-900 text-sm">Recent Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                )}

                {/* Dropdown Contents */}
                {user.role === 'Faculty' && activeTab === 'recovery' ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {requests.filter(r => r.status === 'Pending').length > 0 ? (
                      requests.filter(r => r.status === 'Pending').map(req => (
                        <div key={req.id} className="p-3 rounded-xl bg-indigo-50/20 border border-indigo-100/30 text-left space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-xs font-black text-indigo-950">{req.studentName}</p>
                              <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{req.subject}</p>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono shrink-0">{req.date}</span>
                          </div>
                          
                          <p className="text-[11px] text-gray-600 italic bg-white/70 p-2 rounded-lg border border-gray-100 leading-normal">
                            "{req.reason}"
                          </p>

                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => rejectRequest(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              Reject
                            </button>
                            <button
                              onClick={() => approveRequest(req.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Approve
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center text-gray-400 space-y-1.5">
                        <Inbox className="w-8 h-8 text-gray-300 stroke-1" />
                        <span className="text-xs font-bold text-gray-500">Inbox Clean</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl transition-colors text-xs ${n.read ? 'hover:bg-gray-50' : 'bg-indigo-50/40 hover:bg-indigo-50/60'}`}>
                        <div className="flex justify-between gap-2 items-start">
                          <p className={`text-gray-800 leading-normal ${n.read ? 'font-normal' : 'font-medium'}`}>{n.text}</p>
                          {!n.read && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1" />}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* User Profile avatar headshot */}
        <div className="flex items-center gap-2 border-l border-gray-200/80 pl-3 md:pl-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform duration-300 shrink-0 cursor-pointer">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1 uppercase tracking-wider">
              {user.role === 'Student' ? 'Student' : user.role === 'Faculty' ? 'Faculty' : 'Administrator'}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};
