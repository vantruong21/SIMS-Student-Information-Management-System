import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { Settings, ShieldAlert, Database, Calendar, Globe, Bell, ToggleRight, ToggleLeft, Save } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const SystemSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings } = useAppStore();
  const { maintenance, registration, notifications, term } = systemSettings;

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-indigo-950 font-display tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-600" />
            System Configurations
          </h2>
          <p className="text-indigo-950/60 font-medium mt-2 text-sm">
            Manage global platform settings, academic terms, and administrative controls.
          </p>
        </div>
        <Button variant="primary" icon={Save}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Settings */}
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-indigo-950">Platform Rules</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-indigo-50">
              <div>
                <p className="font-bold text-indigo-950">Student Registration</p>
                <p className="text-xs text-gray-500 mt-1">Allow new students to self-register</p>
              </div>
              <button onClick={() => updateSystemSettings({ registration: !registration })} className={`transition-colors ${registration ? 'text-emerald-500' : 'text-gray-400'}`}>
                {registration ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-indigo-50">
              <div>
                <p className="font-bold text-indigo-950">System Notifications</p>
                <p className="text-xs text-gray-500 mt-1">Send email alerts for major events</p>
              </div>
              <button onClick={() => updateSystemSettings({ notifications: !notifications })} className={`transition-colors ${notifications ? 'text-indigo-500' : 'text-gray-400'}`}>
                {notifications ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>
          </div>
        </GlassPanel>

        {/* Academic Cycle */}
        <GlassPanel className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-indigo-950">Academic Cycle</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Active Semester</label>
              <select 
                value={term}
                onChange={(e) => updateSystemSettings({ term: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-indigo-950 cursor-pointer"
              >
                <option value="Spring 2024">Spring 2024</option>
                <option value="Summer 2024">Summer 2024</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
              </select>
            </div>

            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl">
              <p className="text-sm font-semibold text-purple-900">End of Term Processing</p>
              <p className="text-xs text-purple-700 mt-1 mb-3">Finalize grades and archive current semester records.</p>
              <Button variant="secondary" className="w-full text-purple-700 hover:bg-purple-100">
                Initiate Term Rollover
              </Button>
            </div>
          </div>
        </GlassPanel>

        {/* Security & Danger Zone */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassPanel className="p-6 border-amber-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Database className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-indigo-950">Data Management</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">Export a complete backup of the database or clear system cache.</p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1">Export Backup</Button>
                <Button variant="secondary" className="flex-1">Clear Cache</Button>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 border-rose-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-rose-600">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-rose-950">Danger Zone</h3>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-rose-100 mb-4">
                <div>
                  <p className="font-bold text-red-900">Maintenance Mode</p>
                  <p className="text-xs text-red-700 mt-1">Lock out non-admin users</p>
                </div>
                <button onClick={() => updateSystemSettings({ maintenance: !maintenance })} className={`transition-colors ${maintenance ? 'text-red-600' : 'text-red-300'}`}>
                  {maintenance ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
