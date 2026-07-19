import re

with open('src/components/StudentDashboard.tsx', 'r') as f:
    code = f.read()

# empty announcements
code = re.sub(
    r'  const announcements = \[.*?\];',
    '  const announcements: any[] = [];',
    code,
    flags=re.DOTALL
)

with open('src/components/StudentDashboard.tsx', 'w') as f:
    f.write(code)

