import re

with open('src/components/admin/DualPanelAllocation.tsx', 'r') as f:
    code = f.read()

code = re.sub(
    r'  const \[selectedClassId, setSelectedClassId\] = useState<string>\(classes\[0\]\?\.id \|\| \'\'\);',
    "  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');\n  const assignStudentsToCourse = useAppStore(state => state.assignStudentsToCourse);\n  const removeStudentFromCourse = useAppStore(state => state.removeStudentFromCourse);",
    code
)

with open('src/components/admin/DualPanelAllocation.tsx', 'w') as f:
    f.write(code)
