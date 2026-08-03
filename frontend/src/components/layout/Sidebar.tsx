import React from 'react';
import { LogOut, LucideIcon, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Badge } from '../ui/Badge';

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  items: SidebarItem[];
  currentTab: string;
  setCurrentTab: (tabId: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  currentTab,
  setCurrentTab,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const logout = useAuthStore(state => state.logout);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Drawer */}
      <nav className={`
        fixed md:sticky top-0 left-0 h-[100dvh] md:h-auto 
        w-64 md:w-56 shrink-0 z-50 md:z-10
        transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="glass-panel h-full md:h-[calc(100vh-3rem)] md:top-6 md:rounded-3xl p-5 flex flex-col justify-between bg-white/70 backdrop-blur-2xl border-white/60 shadow-[0_8px_32px_rgba(79,70,229,0.05)] overflow-y-auto">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-sm tracking-tighter">
                  dat
                </div>
                <h1 className="font-display font-extrabold text-xl tracking-tight text-indigo-950">Elevate <span className="text-indigo-600 font-medium">Edu</span></h1>
              </div>
              <button 
                className="md:hidden p-2 bg-indigo-50 rounded-full text-indigo-950 cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-1.5 flex-1">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
                      currentTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold' 
                        : 'text-gray-500 hover:bg-white/80 hover:text-indigo-900 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${currentTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                      <span className="text-[13px]">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        currentTab === item.id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/50 border border-indigo-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all font-bold text-[13px] cursor-pointer shadow-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Log out</span>
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400">Elevate Edu System v4.2.0</p>
            </div>
          </div>

        </div>
      </nav>
    </>
  );
};
