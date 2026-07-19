import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "  const handleApproveStudent = useCallback((studentId: string) => {",
    "  const updateStudentStatus = useAppStore(state => state.updateStudentStatus);\n  const handleApproveStudent = useCallback((studentId: string) => {\n    updateStudentStatus(studentId, 'Active');\n    showToast(`Successfully approved academic credentials for: ${studentId}`, 'success');\n  }, [showToast, updateStudentStatus]);\n  /*"
)

code = code.replace(
    "  // Handle student delete",
    "*/\n  // Handle student delete"
)

code = code.replace(
    "  const handleDeleteStudent = useCallback((studentId: string) => {",
    "  const deleteStudent = useAppStore(state => state.deleteStudent);\n  const handleDeleteStudent = useCallback((studentId: string) => {\n    deleteStudent(studentId);\n    showToast(`Successfully deleted student profile: ${studentId}`, 'success');\n  }, [showToast, deleteStudent]);\n  /*"
)

code = code.replace(
    "  const handleAddLocalStudent = useCallback((student: Student) => {",
    "*/\n  const addStudent = useAppStore(state => state.addStudent);\n  const handleAddLocalStudent = useCallback((student: Student) => {\n    addStudent(student);\n  }, [addStudent]);\n  /*"
)

code = code.replace(
    "  const handleImportLocalStudents = useCallback((students: Student[]) => {",
    "*/\n  const handleImportLocalStudents = useCallback((newStudents: Student[]) => {\n    newStudents.forEach(s => addStudent(s));\n  }, [addStudent]);\n  /*"
)

code = code.replace(
    "  const students = useAppStore(state => state.students);",
    "*/\n  const students = useAppStore(state => state.students);"
)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(code)

