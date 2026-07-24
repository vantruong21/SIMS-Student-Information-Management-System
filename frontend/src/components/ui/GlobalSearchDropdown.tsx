import React from 'react';
import { Search, User, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface GlobalSearchDropdownProps {
  query: string;
  onClose: () => void;
  onSelect: (result: { type: 'student' | 'faculty' | 'course'; data: any }) => void;
}

export const GlobalSearchDropdown: React.FC<GlobalSearchDropdownProps> = ({ query, onClose, onSelect }) => {
  const { students, faculty, courses } = useAppStore();

  if (!query.trim()) return null;

  const lowerQuery = query.toLowerCase();

  const matchedStudents = students.filter(s => s.name.toLowerCase().includes(lowerQuery) || s.email.toLowerCase().includes(lowerQuery)).slice(0, 3);
  const matchedFaculty = faculty.filter(f => f.name.toLowerCase().includes(lowerQuery) || f.email.toLowerCase().includes(lowerQuery)).slice(0, 3);
  const matchedCourses = courses.filter(c => c.name.toLowerCase().includes(lowerQuery) || c.code.toLowerCase().includes(lowerQuery)).slice(0, 3);

  const hasResults = matchedStudents.length > 0 || matchedFaculty.length > 0 || matchedCourses.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full mt-2 left-0 right-0 lg:w-[400px] bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {!hasResults ? (
          <div className="p-8 text-center">
            <Search className="w-8 h-8 text-indigo-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-indigo-950">No results found</p>
            <p className="text-xs text-gray-500 mt-1">Try searching for a different term.</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
            
            {matchedStudents.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">Students</div>
                {matchedStudents.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => { onSelect({ type: 'student', data: s }); onClose(); }}
                    className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-2xl transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}

            {matchedFaculty.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">Faculty</div>
                {matchedFaculty.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => { onSelect({ type: 'faculty', data: f }); onClose(); }}
                    className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-2xl transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}

            {matchedCourses.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">Courses</div>
                {matchedCourses.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => { onSelect({ type: 'course', data: c }); onClose(); }}
                    className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-2xl transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-950 group-hover:text-indigo-600 transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.code}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}
            
          </div>
        )}
      </div>
    </>
  );
};
