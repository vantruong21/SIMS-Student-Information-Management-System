import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "import { Student, Course } from '../types';",
    "import { Student, Course } from '../types';\nimport { useAppStore } from '../store/useAppStore';"
)

# Remove localStudents state
code = re.sub(r'  const \[localStudents, setLocalStudents\] = useState<Student\[\]>\(\[\]\);\n', '', code)

# Replace localStudents uses
code = code.replace(
    "  const combinedStudentsCount = useMemo(() => {\n    return localStudents.length;\n  }, [localStudents]);",
    "  const students = useAppStore(state => state.students);\n  const combinedStudentsCount = students.length;"
)

code = code.replace("localStudents={localStudents}", "localStudents={students}")
code = code.replace(
    "students={localStudents.length > 0 ? [...localStudents, ...getSeededStudents()] : getSeededStudents()}",
    "students={students}"
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(code)
