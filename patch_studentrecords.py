import re

with open('src/components/StudentRecords.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "import { Course } from '../types';",
    "import { Course } from '../types';\nimport { useAppStore } from '../store/useAppStore';\nimport { useAuthStore } from '../store/useAuthStore';"
)

code = re.sub(
    r'  // Completed courses list simulation - cleared as requested\n  const pastCourses: any\[\] = \[\];',
    '''  const user = useAuthStore(state => state.user);
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
''',
    code
)

with open('src/components/StudentRecords.tsx', 'w') as f:
    f.write(code)

