import re

# Update CsvImportWizard.tsx
with open('src/components/admin/CsvImportWizard.tsx', 'r') as f:
    code = f.read()

code = code.replace("cols[2] || 'Computer Science'", "cols[2] || 'Software Engineering'")
code = code.replace("Active and Computer Science.", "Active and Software Engineering.")

with open('src/components/admin/CsvImportWizard.tsx', 'w') as f:
    f.write(code)

# Update UsersDataTable.tsx (was missed before in one place)
with open('src/components/admin/UsersDataTable.tsx', 'r') as f:
    code = f.read()

code = code.replace("setNewProgram('Computer Science')", "setNewProgram('Software Engineering')")

with open('src/components/admin/UsersDataTable.tsx', 'w') as f:
    f.write(code)

# Update DashboardAnalytics.tsx
with open('src/components/DashboardAnalytics.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "{ name: 'Computer Science', students: 4850, fill: '#4f46e5' },",
    "{ name: 'Software Engineering', students: 4850, fill: '#4f46e5' },"
)
code = code.replace(
    "{ name: 'Data Analytics', students: 3100, fill: '#06b6d4' },",
    "{ name: 'Graphic Design', students: 3100, fill: '#06b6d4' },"
)
code = code.replace(
    "{ name: 'Business Administration', students: 2800, fill: '#8b5cf6' }",
    "{ name: 'Marketing', students: 2800, fill: '#8b5cf6' }"
)

with open('src/components/DashboardAnalytics.tsx', 'w') as f:
    f.write(code)

