import React, { useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { Settings, ShieldAlert, Database, Calendar, Globe, ToggleRight, ToggleLeft, Save, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SystemSettingsProps {
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ onShowToast }) => {
  const { systemSettings, updateSystemSettings, refreshData, students, faculty, courses, departments } = useAppStore();
  const { maintenance, registration, notifications, term } = systemSettings;


  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (onShowToast) onShowToast(msg, type);
  };

  const handleSaveChanges = () => {
    updateSystemSettings(systemSettings);
    setIsSaved(true);
    notify('System configurations saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRollover = () => {
    const terms = ['Spring 2024', 'Summer 2024', 'Fall 2024', 'Spring 2025', 'Fall 2025'];
    const currentIdx = terms.indexOf(term);
    const nextTerm = terms[(currentIdx + 1) % terms.length];
    updateSystemSettings({ term: nextTerm });
    notify(`Academic term rollover completed! Current semester updated to ${nextTerm}.`);
  };

  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        systemSettings,
        studentsCount: students.length,
        facultyCount: faculty.length,
        coursesCount: courses.length,
        departmentsCount: departments.length,
        data: {
          students,
          faculty,
          courses,
          departments
        }
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sims_system_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      notify('Database backup exported successfully!');
    } catch (err) {
      notify('Failed to export backup.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      localStorage.removeItem('elevate_system_settings');
      await refreshData();
      notify('System cache cleared & re-synchronized with C# API backend!');

    } catch (err) {
      notify('Failed to clear cache.', 'error');
    } finally {
      setIsClearing(false);
    }
  };

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
        <Button 
          variant={isSaved ? 'secondary' : 'primary'} 
          icon={isSaved ? Check : Save}
          onClick={handleSaveChanges}
        >
          {isSaved ? 'Saved!' : 'Save Changes'}
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
              <button 
                onClick={() => {
                  const next = !registration;
                  updateSystemSettings({ registration: next });
                  notify(`Student registration ${next ? 'enabled' : 'disabled'}.`);
                }} 
                className={`transition-colors cursor-pointer ${registration ? 'text-emerald-500' : 'text-gray-400'}`}
              >
                {registration ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-indigo-50">
              <div>
                <p className="font-bold text-indigo-950">System Notifications</p>
                <p className="text-xs text-gray-500 mt-1">Send email alerts for major events</p>
              </div>
              <button 
                onClick={() => {
                  const next = !notifications;
                  updateSystemSettings({ notifications: next });
                  notify(`System notifications ${next ? 'enabled' : 'disabled'}.`);
                }} 
                className={`transition-colors cursor-pointer ${notifications ? 'text-indigo-500' : 'text-gray-400'}`}
              >
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
                onChange={(e) => {
                  updateSystemSettings({ term: e.target.value });
                  notify(`Active semester set to: ${e.target.value}`);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-indigo-950 cursor-pointer"
              >
                <option value="Spring 2024">Spring 2024</option>
                <option value="Summer 2024">Summer 2024</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Fall 2025">Fall 2025</option>
              </select>
            </div>

            <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl">
              <p className="text-sm font-semibold text-purple-900">End of Term Processing</p>
              <p className="text-xs text-purple-700 mt-1 mb-3">Finalize grades and archive current semester records.</p>
              <Button 
                variant="secondary" 
                onClick={handleRollover}
                className="w-full text-purple-700 hover:bg-purple-100 cursor-pointer"
              >
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
                <Button 
                  variant="secondary" 
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="flex-1 cursor-pointer"
                >
                  {isExporting ? 'Exporting...' : 'Export Backup'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="flex-1 cursor-pointer"
                >
                  {isClearing ? 'Syncing...' : 'Clear Cache'}
                </Button>
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
                <button 
                  onClick={() => {
                    const next = !maintenance;
                    updateSystemSettings({ maintenance: next });
                    notify(`Maintenance mode ${next ? 'ACTIVATED' : 'deactivated'}.`, next ? 'error' : 'success');
                  }} 
                  className={`transition-colors cursor-pointer ${maintenance ? 'text-red-600' : 'text-red-300'}`}
                >
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

