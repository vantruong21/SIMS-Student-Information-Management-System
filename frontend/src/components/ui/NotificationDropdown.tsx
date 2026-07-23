import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose, userRole }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'System Backup Completed',
      message: 'Automated database backup was successful.',
      time: '10 mins ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Registrations',
      message: '3 new students are pending approval.',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Server Load Alert',
      message: 'CPU usage spiked to 85% temporarily.',
      time: '2 hours ago'
    }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div className="absolute top-full mt-3 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-indigo-950">Notifications</h3>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
              {notifications.length} NEW
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex gap-3 p-3 hover:bg-indigo-50/50 rounded-2xl transition-colors cursor-pointer group">
              <div className="shrink-0 mt-0.5">
                {notif.type === 'success' && <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>}
                {notif.type === 'warning' && <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><AlertCircle className="w-4 h-4" /></div>}
                {notif.type === 'info' && <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Info className="w-4 h-4" /></div>}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{notif.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-1.5">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
};
