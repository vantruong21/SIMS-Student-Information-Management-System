with open('src/components/StudentRecords.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "{c.grade} ({c.gpaContribution.toFixed(1)})",
    "{c.grade} ({(gradeGPAMap[c.grade] || 0).toFixed(1)})"
)

with open('src/components/StudentRecords.tsx', 'w') as f:
    f.write(code)
