import re

with open('src/components/DashboardAnalytics.tsx', 'r') as f:
    code = f.read()

replacement = """  const adminProgramData = [
    { name: 'Software Engineering', students: 4850, fill: '#4f46e5' },
    { name: 'Marketing', students: 3120, fill: '#06b6d4' },
    { name: 'Graphic Design', students: 1650, fill: '#8b5cf6' }
  ];"""

code = re.sub(
    r'  const adminProgramData = \[.*?\];',
    replacement,
    code,
    flags=re.DOTALL
)

with open('src/components/DashboardAnalytics.tsx', 'w') as f:
    f.write(code)

