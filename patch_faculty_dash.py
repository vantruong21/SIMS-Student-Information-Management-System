import re

with open('src/components/faculty/FacultyDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace("'Computer Science Essentials'", "'Application Development'")

with open('src/components/faculty/FacultyDashboard.tsx', 'w') as f:
    f.write(code)

