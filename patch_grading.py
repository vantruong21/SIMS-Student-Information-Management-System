import re

with open('src/components/faculty/FacultyGrading.tsx', 'r') as f:
    code = f.read()

# Replace imports
code = code.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport { useAppStore } from '../../store/useAppStore';"
)

# Replace internal state and references
code = re.sub(r'const INITIAL_CLASSES: ClassDetails\[\] = \[.*?\];', '', code, flags=re.DOTALL)
code = re.sub(r'const INITIAL_GRADES: Record<string, StudentGrade\[\]> = \{.*?\};', '', code, flags=re.DOTALL)

code = code.replace(
    "  const [grades, setGrades] = useState<Record<string, StudentGrade[]>>(INITIAL_GRADES);",
    """  const courses = useAppStore(state => state.courses);
  const enrollments = useAppStore(state => state.enrollments);
  const students = useAppStore(state => state.students);
  const appGrades = useAppStore(state => state.grades);
  const updateGrade = useAppStore(state => state.updateGrade);
"""
)

# handleGradeChange
code = re.sub(
    r'    setGrades\(prev => \{\n.*?    \}\);\n',
    r'''    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateGrade(studentId, selectedClassId, field, numValue);
    }
''',
    code,
    flags=re.DOTALL
)

# Derived data
code = code.replace(
    "  const activeClass = INITIAL_CLASSES.find(c => c.id === selectedClassId);",
    """  const activeClass = courses.find(c => c.id === selectedClassId);
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
"""
)

code = code.replace(
    "  const currentClassGrades = selectedClassId ? grades[selectedClassId] : [];",
    ""
)

# Remove `INITIAL_CLASSES.map` logic
code = re.sub(
    r'            \{INITIAL_CLASSES\.map\(\(cls\) => \{.*?\n              const isCompleted = cls\.status === \'Completed\';',
    r'''            {courses.map((cls) => {
              const classEnrollments = enrollments.filter(e => e.courseId === cls.id);
              const classAverage = '—';
              const isCompleted = cls.status === 'Completed';''',
    code,
    flags=re.DOTALL
)

code = code.replace("studentsCount: cls.studentsCount", "studentsCount: classEnrollments.length")

with open('src/components/faculty/FacultyGrading.tsx', 'w') as f:
    f.write(code)

