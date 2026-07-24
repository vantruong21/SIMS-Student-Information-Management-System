import React from 'react';
import { 
  Calendar,
  Clock, 
  MapPin, 
  Bookmark, 
  Play
} from 'lucide-react';
import { Course } from '../../types';
import { GlassPanel } from '../ui/GlassPanel';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';

interface FacultyScheduleProps {
  courses: Course[];
  onSelectSlot: (slotId: string, slotName: string) => void;
}

export const FacultySchedule: React.FC<FacultyScheduleProps> = ({ courses, onSelectSlot }) => {
  const daysOfWeek: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const user = useAuthStore(state => state.user);
  
  // Case-insensitive filtering of faculty courses
  const facultyCourses = courses.filter(c => 
    c.instructor?.toLowerCase() === user?.name?.toLowerCase()
  );

  // Helper to parse days from schedule string
  const parseDaysFromSchedule = (scheduleStr: string): Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> => {
    const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [];
    const normalized = scheduleStr.toLowerCase();
    
    if (normalized.includes('mon') || normalized.includes('m/')) days.push('Monday');
    if (normalized.includes('tue') || normalized.includes('t/')) days.push('Tuesday');
    if (normalized.includes('wed') || normalized.includes('w/')) days.push('Wednesday');
    if (normalized.includes('thu') || normalized.includes('th/')) days.push('Thursday');
    if (normalized.includes('fri') || normalized.includes('f/')) days.push('Friday');
    
    // Parse common codes
    if (normalized.includes('tth')) {
      if (!days.includes('Tuesday')) days.push('Tuesday');
      if (!days.includes('Thursday')) days.push('Thursday');
    }
    if (normalized.includes('mw')) {
      if (!days.includes('Monday')) days.push('Monday');
      if (!days.includes('Wednesday')) days.push('Wednesday');
    }
    if (normalized.includes('mwf')) {
      if (!days.includes('Monday')) days.push('Monday');
      if (!days.includes('Wednesday')) days.push('Wednesday');
      if (!days.includes('Friday')) days.push('Friday');
    }

    if (days.length === 0) days.push('Monday'); // Fallback
    return days;
  };

  // Map courses to all their scheduled days
  const scheduleEvents = facultyCourses.flatMap((c, idx) => {
    const days = parseDaysFromSchedule(c.schedule || 'Monday');
    return days.map(day => ({
      id: c.id,
      courseName: c.name,
      courseCode: c.code,
      day,
      time: c.schedule || '10:00 AM - 12:00 PM',
      room: `Main Campus Room ${301 + idx}`,
    }));
  });

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Master Timetable
        </span>
        <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Weekly Teaching Schedule</h3>
        <p className="text-xs text-gray-500 mt-1">
          Complete overview of your allocated lecture blocks. Click any class to take attendance (updates DB).
        </p>
      </div>

      <div>
        <h4 className="font-display text-xs font-black uppercase text-indigo-900 tracking-wider mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Full Week Matrix</span>
        </h4>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          {daysOfWeek.map((day) => {
            const dayEvents = scheduleEvents.filter(e => e.day === day);
            const isToday = day === todayName;

            return (
              <GlassPanel 
                key={day} 
                className={`flex flex-col gap-4 min-h-[300px] transition-all p-4 ${
                  isToday ? 'border-indigo-300 shadow-[0_8px_32px_rgba(79,70,229,0.08)] bg-white/70' : ''
                }`}
              >
                <div className="pb-3 border-b border-indigo-100/60 flex items-center justify-between">
                  <span className={`font-display font-extrabold text-sm ${isToday ? 'text-indigo-600' : 'text-indigo-950'}`}>
                    {day}
                  </span>
                  <Badge variant="info">
                    {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
                  </Badge>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div 
                        key={`${event.id}-${event.day}`}
                        onClick={() => onSelectSlot(event.id, event.courseName)}
                        className={`p-4 rounded-2xl transition-all duration-300 relative group text-left cursor-pointer border ${
                          isToday
                            ? 'bg-white border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-400'
                            : 'bg-white/60 border-white hover:bg-white hover:border-indigo-200'
                        }`}
                      >
                        <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-md transition-transform group-hover:scale-y-110 ${isToday ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]' : 'bg-gray-300 group-hover:bg-indigo-400'}`} />
                        
                        <div className="pl-3 space-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-[9px] font-bold text-indigo-500 font-mono tracking-wider">
                              {event.courseCode}
                            </p>
                            {isToday && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-0.5 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                            )}
                          </div>
                          <p className="text-xs font-extrabold text-indigo-950 leading-tight">
                            {event.courseName}
                          </p>
                          
                          <div className="space-y-1.5 text-[10px] text-gray-500 pt-2 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate">{event.room}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Action Overlay - Active for all classes */}
                        <div className="absolute inset-x-0 bottom-0 top-0 rounded-2xl backdrop-blur-[2px] bg-indigo-900/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1.5 transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-3 h-3 fill-white" />
                            Take Attendance
                          </div>
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-6 text-center px-4">
                      <Bookmark className="w-8 h-8 text-indigo-100 mb-2" strokeWidth={1} />
                      <span className="text-[10px] font-bold text-indigo-300">No lectures scheduled</span>
                      <span className="text-[9px] text-gray-400 mt-1">Enjoy your free time for research!</span>
                    </div>
                  )}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
};

