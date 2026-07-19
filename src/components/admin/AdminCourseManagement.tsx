import React from 'react';
import { Course } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Settings2 } from 'lucide-react';

interface AdminCourseManagementProps {
  courses: Course[];
}

// Available faculty members (mock list)
const FACULTY_MEMBERS = [
  'Dr. Smith',
  'Dr. Jones',
  'Prof. Turing',
  'Prof. Miller',
  'Dr. Davis',
  'Prof. Wilson',
  'Prof. Carter',
  'Dr. Lee',
  'Prof. White',
  'Dr. Richard Feynman',
  'Prof. Marie Curie',
  'Staff Academic'
];

export const AdminCourseManagement: React.FC<AdminCourseManagementProps> = ({ courses }) => {
  const updateCourseInstructor = useAppStore(state => state.updateCourseInstructor);

  const handleInstructorChange = (courseId: string, newInstructor: string) => {
    updateCourseInstructor(courseId, newInstructor);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 text-left animate-in fade-in duration-500">
      <div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Faculty Allocation
        </span>
        <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Class Allocation & Scheduling Matrix</h3>
        <p className="text-xs text-gray-500 mt-1">Manage teaching assignments, timeslots, room coordinates, and credit metrics. Assign faculty directly to courses.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 text-xs font-bold uppercase text-gray-500 border-b border-white/50">
              <th className="p-4">Course Code</th>
              <th className="p-4">Course Title</th>
              <th className="p-4">Assigned Faculty</th>
              <th className="p-4">Schedule Block</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm divide-y divide-white/20">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-white/30 transition-colors group">
                <td className="p-4 font-mono font-bold text-indigo-950">{course.code}</td>
                <td className="p-4 text-gray-700 font-medium">{course.name}</td>
                <td className="p-4">
                  <div className="relative flex items-center">
                    <select 
                      value={course.instructor}
                      onChange={(e) => handleInstructorChange(course.id, e.target.value)}
                      className="appearance-none bg-white/60 border border-white hover:border-indigo-200 text-indigo-950 text-xs font-bold rounded-xl px-3 py-2 pr-8 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all w-full max-w-[200px]"
                    >
                      {/* Make sure the current instructor is always in the list even if custom */}
                      {!FACULTY_MEMBERS.includes(course.instructor) && (
                        <option value={course.instructor}>{course.instructor}</option>
                      )}
                      {FACULTY_MEMBERS.map(faculty => (
                        <option key={faculty} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                    <Settings2 className="w-3.5 h-3.5 text-indigo-400 absolute right-3 pointer-events-none group-hover:text-indigo-600 transition-colors" />
                  </div>
                </td>
                <td className="p-4 text-gray-500">{course.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
