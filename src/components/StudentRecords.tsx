import React, { useState } from 'react';
import { FileText, Download, Calculator, Sparkles, GraduationCap } from 'lucide-react';
import { Course } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { GlassEmptyState } from './GlassEmptyState';

export const StudentRecords: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const courses = useAppStore(state => state.courses);
  const enrollments = useAppStore(state => state.enrollments);
  const grades = useAppStore(state => state.grades);

  const pastCourses = enrollments
    .filter(e => e.studentId === user?.id)
    .map(e => {
      const c = courses.find(c => c.id === e.courseId);
      const g = grades.find(g => g.studentId === user?.id && g.courseId === e.courseId);
      const assignment = g?.assignment || 0;
      const midterm = g?.midterm || 0;
      const finalGrade = g?.final || 0;
      const avg = assignment * 0.3 + midterm * 0.3 + finalGrade * 0.4;
      
      let letter = 'F';
      if (avg >= 90) letter = 'A';
      else if (avg >= 80) letter = 'B';
      else if (avg >= 70) letter = 'C';
      else if (avg >= 60) letter = 'D';

      return {
        id: e.courseId,
        code: c?.code || 'N/A',
        name: c?.name || 'Unknown',
        credits: c?.credits || 3,
        grade: letter
      };
    });


  // Simulator grades state
  const [simGrade1, setSimGrade1] = useState('A');
  const [simGrade2, setSimGrade2] = useState('B');

  const gradeGPAMap: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
  };

  // Calculate cumulative simulator GPA
  const totalPastCredits = pastCourses.reduce((sum, c) => sum + c.credits, 0);
  const totalPastPoints = pastCourses.reduce((sum, c) => sum + ((gradeGPAMap[c.grade] || 0) * c.credits), 0);

  const currentActiveCredits1 = 4; // Adv Calculus credits
  const currentActiveCredits2 = 4; // Quantum Physics credits

  const simulatedPoints = totalPastPoints + 
    (gradeGPAMap[simGrade1] * currentActiveCredits1) + 
    (gradeGPAMap[simGrade2] * currentActiveCredits2);
  
  const simulatedTotalCredits = totalPastCredits + currentActiveCredits1 + currentActiveCredits2;
  const simulatedGPA = simulatedPoints / simulatedTotalCredits;

  const creditsCompleted = totalPastCredits;
  const totalCreditsNeeded = 140;
  const curriculumProgressPercentage = (creditsCompleted / totalCreditsNeeded) * 100;

  return (
    <div className="space-y-6 text-gray-800 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Academic Ledger
          </span>
          <h3 className="font-display text-lg font-bold text-indigo-950 mt-2">Academic Transcript & Records</h3>
          <p className="text-xs text-gray-500 mt-1">Review official historical transcripts, cumulative credits, and prospective GPA models.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 duration-200 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Official PDF Transcript</span>
        </button>
      </div>

      {/* Curriculum Graduation Progress Bar */}
      <div className="glass-panel rounded-3xl p-5 border border-white/50 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">Curriculum Completion Matrix</h4>
              <p className="text-[10px] text-gray-400 font-medium">Accumulated credits toward Bachelor of Science Degree</p>
            </div>
          </div>
          <span className="text-xs font-black text-indigo-600 font-mono">
            {creditsCompleted} / {totalCreditsNeeded} Credits completed ({Math.round(curriculumProgressPercentage)}%)
          </span>
        </div>

        {/* Beautiful Glass Progress Bar */}
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden p-[2px] border border-gray-200/50">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_2px_4px_rgba(79,70,229,0.3)]"
            style={{ width: `${curriculumProgressPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Full Past Transcript History List */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 shadow-sm border border-white/50 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/50">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h4 className="font-display text-sm font-bold text-indigo-950">Completed Coursework History</h4>
          </div>

          {pastCourses.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-indigo-100/40 bg-white/30">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50/50 text-[10px] sm:text-xs uppercase font-bold tracking-wider text-indigo-900 border-b border-indigo-100/50">
                    <th className="p-4 font-bold">Course Code</th>
                    <th className="p-4 font-bold">Course Title</th>
                    <th className="p-4 text-center font-bold">Credits</th>
                    <th className="p-4 text-right font-bold">Score / Grade</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-indigo-50/50">
                  {pastCourses.map((c) => (
                    <tr key={c.code} className="hover:bg-white/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-950">{c.code}</td>
                      <td className="p-4 text-gray-700 font-medium">{c.name}</td>
                      <td className="p-4 text-center text-gray-600 font-bold">{c.credits}</td>
                      <td className="p-4 text-right">
                        <span className="inline-block px-2.5 py-1 bg-indigo-50 font-bold text-indigo-600 rounded-lg text-xs">
                          {c.grade} ({(gradeGPAMap[c.grade] || 0).toFixed(1)})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <GlassEmptyState
              title="No Past Coursework History"
              description="There are currently no completed historical courses recorded on your academic ledger profile."
            />
          )}
        </div>

        {/* GPA Simulator Box */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-indigo-100/50">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h4 className="font-display text-sm font-bold text-indigo-950">Cumulative GPA Simulator</h4>
            </div>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-medium">
              Predict your cumulative GPA block by adjusting expectations for active courses currently underway.
            </p>

            <div className="space-y-4 mt-6">
              {/* Course 1 Grade Selection */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Application Development</label>
                <select 
                  value={simGrade1}
                  onChange={(e) => setSimGrade1(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-100 bg-white outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer font-bold text-indigo-950"
                >
                  <option value="A">A (Excellent - 4.0)</option>
                  <option value="A-">A- (3.7)</option>
                  <option value="B+">B+ (3.3)</option>
                  <option value="B">B (Good - 3.0)</option>
                  <option value="C+">C+ (2.3)</option>
                  <option value="C">C (Pass - 2.0)</option>
                  <option value="F">F (Fail - 0.0)</option>
                </select>
              </div>

              {/* Course 2 Grade Selection */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Applied Programming & Design</label>
                <select 
                  value={simGrade2}
                  onChange={(e) => setSimGrade2(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-100 bg-white outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer font-bold text-indigo-950"
                >
                  <option value="A">A (Excellent - 4.0)</option>
                  <option value="A-">A- (3.7)</option>
                  <option value="B+">B+ (3.3)</option>
                  <option value="B">B (Good - 3.0)</option>
                  <option value="C+">C+ (2.3)</option>
                  <option value="C">C (Pass - 2.0)</option>
                  <option value="F">F (Fail - 0.0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simulated GPA output */}
          <div className="mt-8 pt-6 border-t border-indigo-50 bg-indigo-50/20 p-4 rounded-2xl border border-indigo-100/50 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Simulated Cumulative GPA</span>
            <span className="font-display text-4xl font-extrabold text-indigo-950 mt-1 block">
              {simulatedGPA.toFixed(2)}
            </span>
            <div className="text-[10px] text-indigo-600 font-bold mt-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Based on {simulatedTotalCredits} accumulated credits</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
