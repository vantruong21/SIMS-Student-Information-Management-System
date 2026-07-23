import React, { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useVirtualizer } from '@tanstack/react-virtual';
import { 
  GraduationCap, 
  ArrowLeft, 
  Calculator, 
  Users, 
  FileSpreadsheet, 
  Check, 
  Loader, 
  Save, 
  Sparkles,
  Info
} from 'lucide-react';
import { GlassEmptyState } from '../GlassEmptyState';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface StudentGrade {
  id: string;
  name: string;
  assignment: number;
  midterm: number;
  final: number;
}

export const FacultyGrading: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const courses = useAppStore(state => state.courses);
  const user = useAuthStore(state => state.user);
  const enrollments = useAppStore(state => state.enrollments);
  const students = useAppStore(state => state.students);
  const appGrades = useAppStore(state => state.grades);
  const updateGrade = useAppStore(state => state.updateGrade);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const parentRef = useRef<HTMLDivElement>(null);

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleGradeChange = async (
    studentId: string, 
    field: 'assignment' | 'midterm' | 'final', 
    value: string
  ) => {
    if (!selectedClassId) return;

    let numVal = parseInt(value, 10);
    if (isNaN(numVal)) numVal = 0;
    numVal = Math.min(100, Math.max(0, numVal));

    await updateGrade(studentId, selectedClassId, field, value !== '' ? numVal : 0);
  };

  const calculateAverage = (g: StudentGrade) => {
    const avg = g.assignment * 0.3 + g.midterm * 0.3 + g.final * 0.4;
    return Math.round(avg * 10) / 10;
  };

  const getLetterGrade = (avg: number) => {
    if (avg >= 90) return { letter: 'A', variant: 'success' as const };
    if (avg >= 80) return { letter: 'B', variant: 'info' as const };
    if (avg >= 70) return { letter: 'C', variant: 'warning' as const };
    if (avg >= 60) return { letter: 'D', variant: 'warning' as const };
    return { letter: 'F', variant: 'error' as const };
  };

  const handleSaveGrades = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1500);
  };

  const activeClass = courses.find(c => c.id === selectedClassId);
  const currentClassGrades = selectedClassId ? enrollments.filter(e => e.courseId === selectedClassId).map(e => {
    const s = students.find(s => s.id === e.studentId);
    const g = appGrades.find(g => g.studentId === e.studentId && g.courseId === selectedClassId) || { assignment: 0, midterm: 0, final: 0 };
    return {
      id: e.studentId,
      name: s?.name || 'Unknown',
      assignment: g.assignment,
      midterm: g.midterm,
      final: g.final
    };
  }) : [];

  const rowVirtualizer = useVirtualizer({
    count: currentClassGrades.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0
    ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0)
    : 0;

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      {!selectedClassId ? (
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Grading Hub
            </span>
            <h3 className="font-display text-lg font-extrabold text-indigo-950 mt-1.5">Milestone Grading Directory</h3>
            <p className="text-xs text-gray-500 mt-1 leading-normal">
              Select one of your assigned course blocks to manage grades in the real-time evaluation workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.filter(c => c.instructor === user?.name).map((cls) => {
              const classEnrollments = enrollments.filter(e => e.courseId === cls.id);
              return (
                <div
                  key={cls.id}
                  onClick={() => handleSelectClass(cls.id)}
                  className="glass-card rounded-3xl p-6 border border-white/60 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[190px] relative overflow-hidden group text-left"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 uppercase tracking-wider">
                        {cls.code}
                      </span>
                      <Badge variant={cls.status === 'Completed' ? 'success' : 'warning'}>
                        {cls.status}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-indigo-950 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                        {cls.name}
                      </h4>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-indigo-100/40 flex items-center justify-between text-xs text-gray-500 mt-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold">{classEnrollments.length} Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-bold text-indigo-950">Avg: —</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <Button variant="secondary" icon={ArrowLeft} onClick={() => setSelectedClassId(null)} className="mb-3">
                Back to Classes
              </Button>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-lg font-extrabold text-indigo-950">
                  {activeClass?.name}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {activeClass?.code}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Double-blind spreadsheet workspace. Changes recalculate automatically on student rows.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-indigo-50/20 p-3 rounded-2xl border border-indigo-100/40">
              <div className="flex items-center gap-2 text-xs">
                <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                <span className="text-gray-500 font-medium">Editing Standard Mode</span>
              </div>
            </div>
          </div>

          <GlassPanel>
            <div className="pb-3 border-b border-indigo-50 mb-6 flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold text-indigo-950">Fast-Entry Spreadsheet Board</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Numeric cells scale up to 100. Hover and focus inputs to start typing grades.</p>
              </div>
              
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                <span>Formula: HW (30%) + Mid (30%) + Final (40%)</span>
              </div>
            </div>

            {currentClassGrades.length > 0 ? (
              <div 
                ref={parentRef} 
                className="overflow-auto rounded-2xl border border-indigo-100/60 bg-white/30 max-h-[600px] custom-scrollbar"
              >
                <table className="w-full text-left border-collapse min-w-[640px] relative">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-indigo-50/95 backdrop-blur text-[10px] font-black uppercase tracking-wider text-indigo-950 border-b border-indigo-100 shadow-sm">
                      <th className="p-4 w-[240px]">Student Scholar</th>
                      <th className="p-4 text-center">Assignment (30%)</th>
                      <th className="p-4 text-center">Mid-term (30%)</th>
                      <th className="p-4 text-center">Final Exam (40%)</th>
                      <th className="p-4 text-center w-[120px]">Weighted Avg</th>
                      <th className="p-4 text-center w-[100px]">Letter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100/30 text-xs font-semibold text-gray-700">
                    {paddingTop > 0 && <tr><td colSpan={6} style={{ height: `${paddingTop}px` }} /></tr>}
                    {virtualItems.map((virtualRow) => {
                      const student = currentClassGrades[virtualRow.index];
                      const avg = calculateAverage(student);
                      const gradeObj = getLetterGrade(avg);

                      return (
                        <tr 
                          key={student.id} 
                          className="hover:bg-indigo-50/20 transition-colors"
                          ref={rowVirtualizer.measureElement}
                          data-index={virtualRow.index}
                        >
                          <td className="p-4 font-bold text-indigo-950 flex items-center gap-2.5 text-left">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-xs font-black">{student.name}</p>
                              <p className="text-[9px] text-gray-400 font-mono mt-0.5">{student.id}</p>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={student.assignment === 0 ? '' : student.assignment}
                              onChange={(e) => handleGradeChange(student.id, 'assignment', e.target.value)}
                              placeholder="0"
                              min="0"
                              max="100"
                              className="w-20 mx-auto text-center px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:bg-white text-xs font-bold outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all font-mono"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={student.midterm === 0 ? '' : student.midterm}
                              onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                              placeholder="0"
                              min="0"
                              max="100"
                              className="w-20 mx-auto text-center px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:bg-white text-xs font-bold outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all font-mono"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              value={student.final === 0 ? '' : student.final}
                              onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                              placeholder="0"
                              min="0"
                              max="100"
                              className="w-20 mx-auto text-center px-2 py-1.5 rounded-lg border border-gray-200 bg-white focus:bg-white text-xs font-bold outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all font-mono"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono text-xs font-black text-indigo-950 bg-gray-100/60 border border-gray-200/50 px-2.5 py-1 rounded-md">
                              {avg}%
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={gradeObj.variant}>{gradeObj.letter}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                    {paddingBottom > 0 && <tr><td colSpan={6} style={{ height: `${paddingBottom}px` }} /></tr>}
                  </tbody>
                </table>
              </div>
            ) : (
              <GlassEmptyState 
                title="No Enrollments Found"
                description="There are currently no students enrolled in this course."
              />
            )}

            <div className="mt-6 pt-6 border-t border-indigo-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-indigo-950 font-bold bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/30 max-w-xl text-left">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <span className="text-[11px] leading-relaxed font-medium">
                  Milestone submissions automatically lock once uploaded. Ensure double-blind standards are adhered to before saving results.
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto shrink-0">
                <Button variant="secondary" onClick={() => setSelectedClassId(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleSaveGrades}
                  disabled={isSaving || saveSuccess}
                  icon={isSaving ? Loader : saveSuccess ? Check : Save}
                  className="min-w-[160px]"
                >
                  {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Submit Grades"}
                </Button>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
