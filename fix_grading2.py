with open('src/components/faculty/FacultyGrading.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "if (!isNaN(numValue)) {" in line:
        lines.insert(i+3, "  };\n")
        break

with open('src/components/faculty/FacultyGrading.tsx', 'w') as f:
    f.writelines(lines)
