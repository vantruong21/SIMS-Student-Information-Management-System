import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace("localStudents={students}", "students={students}")

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(code)
