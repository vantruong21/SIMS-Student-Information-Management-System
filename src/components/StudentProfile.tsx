import React, { useState } from 'react';
import { User, ShieldAlert, FileText, Smartphone, MapPin, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface StudentProfileProps {
  user: UserProfile;
  onUpdateProfile: (user: UserProfile) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ user, onUpdateProfile }) => {
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name: nameInput
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div>
        <h3 className="font-display text-lg font-bold text-indigo-950">My Profile</h3>
        <p className="text-xs text-gray-500 mt-1">Manage and update your academic bio, emergency contacts, and housing records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Photo & Quick stats card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-fit border border-white/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          
          {/* Avatar frame */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 group shrink-0">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
            </div>
          </div>

          <h4 className="font-display text-base font-bold text-indigo-950">{user.name}</h4>
          <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-widest">
            {user.role === 'Student' ? 'Full-Time Scholar' : user.role === 'Faculty' ? 'Faculty Member' : 'Administrator'}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">{user.email}</p>

          <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-indigo-50/80">
            <div className="p-2 bg-indigo-50/40 rounded-xl border border-indigo-50">
              <span className="text-[10px] text-gray-400 block font-medium">Cohort</span>
              <span className="text-xs font-bold text-indigo-950 mt-0.5 block">-</span>
            </div>
            <div className="p-2 bg-indigo-50/40 rounded-xl border border-indigo-50">
              <span className="text-[10px] text-gray-400 block font-medium">Academic Advisor</span>
              <span className="text-xs font-bold text-indigo-950 mt-0.5 block truncate">-</span>
            </div>
          </div>
        </div>

        {/* Right Side: Editable Details Form */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 lg:col-span-2 shadow-sm border border-white/50">
          <h4 className="font-display text-sm font-bold text-indigo-950 mb-6 pb-2 border-b border-indigo-100/50">
            Personal Bio & Background Details
          </h4>

          {isSaved && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Profile background metrics successfully synchronized!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    required
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Contact Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    required
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Permanent Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    required
                    value={addressInput}
                    onChange={e => setAddressInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
