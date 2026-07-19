import re

with open('src/components/StudentRecords.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "const totalPastPoints = pastCourses.reduce((sum, c) => sum + (c.gpaContribution * c.credits), 0);",
    "const totalPastPoints = pastCourses.reduce((sum, c) => sum + ((gradeGPAMap[c.grade] || 0) * c.credits), 0);"
)

code = code.replace(
    "<span>{course.gpaContribution?.toFixed(1)}</span>",
    "<span>{(gradeGPAMap[course.grade] || 0).toFixed(1)}</span>"
)

with open('src/components/StudentRecords.tsx', 'w') as f:
    f.write(code)
