import re

with open('src/components/faculty/FacultyGrading.tsx', 'r') as f:
    code = f.read()

code = code.replace(
"""    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateGrade(studentId, selectedClassId, field, numValue);
    }
  // Live weighted average calculation""",
"""    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateGrade(studentId, selectedClassId, field, numValue);
    }
  };
  // Live weighted average calculation"""
)

with open('src/components/faculty/FacultyGrading.tsx', 'w') as f:
    f.write(code)

