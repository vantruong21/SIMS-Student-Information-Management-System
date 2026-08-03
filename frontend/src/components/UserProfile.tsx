import React, { useState } from 'react';
import { User, ShieldAlert, FileText, Smartphone, MapPin, Check, Sparkles, Eye, EyeOff, X } from 'lucide-react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  user: UserProfileType;
  onUpdateProfile: (data: { phone?: string; password?: string }) => void;
}

/**
 * Kiểm tra độ mạnh mật khẩu: ≥8 ký tự, chữ hoa, chữ thường, ký tự đặc biệt.
 * Trả về mảng lỗi (rỗng nếu hợp lệ).
 */
function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  if (!password || password.length < 8)
    errors.push('Ít nhất 8 ký tự');
  if (!/[A-Z]/.test(password))
    errors.push('Ít nhất 1 chữ HOA (A-Z)');
  if (!/[a-z]/.test(password))
    errors.push('Ít nhất 1 chữ thường (a-z)');
  if (!/[^a-zA-Z0-9\s]/.test(password))
    errors.push('Ít nhất 1 ký tự đặc biệt (@, $, !, %, *, ?, &, #...)');
  return errors;
}

/**
 * Tính điểm độ mạnh mật khẩu: 0–4
 */
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[^a-zA-Z0-9\s]/.test(password)) score++;

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Rất yếu', color: 'bg-red-500' },
    { score: 2, label: 'Yếu', color: 'bg-orange-400' },
    { score: 3, label: 'Trung bình', color: 'bg-yellow-400' },
    { score: 4, label: 'Mạnh', color: 'bg-emerald-500' },
  ];
  return levels[score];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pwErrors, setPwErrors] = useState<string[]>([]);

  const strength = getPasswordStrength(passwordInput);

  const handlePasswordChange = (val: string) => {
    setPasswordInput(val);
    if (val) {
      setPwErrors(validatePasswordStrength(val));
    } else {
      setPwErrors([]);
    }
    setErrorMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Nếu người dùng có nhập mật khẩu mới
    if (passwordInput) {
      const errors = validatePasswordStrength(passwordInput);
      if (errors.length > 0) {
        setErrorMsg('Mật khẩu chưa đủ mạnh. Vui lòng kiểm tra lại các yêu cầu bên dưới.');
        setPwErrors(errors);
        return;
      }
      if (passwordInput !== confirmPassword) {
        setErrorMsg('Xác nhận mật khẩu không khớp.');
        return;
      }
    }

    onUpdateProfile({
      phone: phoneInput,
      password: passwordInput || undefined
    });

    setPasswordInput('');
    setConfirmPassword('');
    setPwErrors([]);
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
              
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Contact Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                  New Password
                  <span className="ml-1 text-gray-400 font-normal normal-case">(để trống nếu không đổi)</span>
                </label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={e => handlePasswordChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {passwordInput && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className={`text-[10px] font-bold ${
                        strength.score === 4 ? 'text-emerald-600' :
                        strength.score === 3 ? 'text-yellow-600' :
                        'text-red-500'
                      }`}>
                        Độ mạnh: {strength.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-start-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white shadow-inner focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Confirm match indicator */}
                {confirmPassword && passwordInput && (
                  <p className={`text-[10px] mt-1 ml-1 font-bold ${confirmPassword === passwordInput ? 'text-emerald-600' : 'text-red-500'}`}>
                    {confirmPassword === passwordInput ? '✓ Mật khẩu khớp' : '✗ Chưa khớp'}
                  </p>
                )}
              </div>

              {/* Password requirements checklist */}
              {passwordInput && pwErrors.length > 0 && (
                <div className="md:col-span-2 p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">Yêu cầu mật khẩu:</p>
                  {[
                    { label: 'Ít nhất 8 ký tự', ok: passwordInput.length >= 8 },
                    { label: 'Ít nhất 1 chữ HOA (A-Z)', ok: /[A-Z]/.test(passwordInput) },
                    { label: 'Ít nhất 1 chữ thường (a-z)', ok: /[a-z]/.test(passwordInput) },
                    { label: 'Ít nhất 1 ký tự đặc biệt (@, $, !, %, #...)', ok: /[^a-zA-Z0-9\s]/.test(passwordInput) },
                  ].map(req => (
                    <div key={req.label} className={`flex items-center gap-1.5 text-[11px] ${req.ok ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {req.ok
                        ? <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        : <X className="w-3 h-3 text-gray-400 shrink-0" />
                      }
                      {req.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Error message */}
              {errorMsg && (
                <div className="md:col-span-2 text-xs text-red-500 font-bold ml-1 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  {errorMsg}
                </div>
              )}

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
