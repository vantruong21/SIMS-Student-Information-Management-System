import re

with open('src/components/admin/DualPanelAllocation.tsx', 'r') as f:
    code = f.read()

# Add useAppStore import
code = code.replace(
    "import { Student, Course } from '../../types';",
    "import { Student, Course } from '../../types';\nimport { useAppStore } from '../../store/useAppStore';"
)

code = code.replace(
    "  const [classes, setClasses] = useState<TargetClass[]>([]);",
    "  const enrollments = useAppStore(state => state.enrollments);\n  const assignStudentsToCourse = useAppStore(state => state.assignStudentsToCourse);\n  const removeStudentFromCourse = useAppStore(state => state.removeStudentFromCourse);"
)

code = re.sub(
    r'  useEffect\(\(\) => \{\n.*?  \}, \[courses\]\);\n',
    '',
    code,
    flags=re.DOTALL
)

code = re.sub(
    r'  const activeClass = classes\.find\(c => c\.id === selectedClassId\);',
    r'''  const activeClassObj = courses.find(c => c.id === selectedClassId);
  const activeClassAssignedIds = enrollments.filter(e => e.courseId === selectedClassId).map(e => e.studentId);
  const activeClassAssignedStudents = students.filter(s => activeClassAssignedIds.includes(s.id));
  const activeClass = activeClassObj ? {
    ...activeClassObj,
    capacity: activeClassObj.capacity || 30,
    assignedCount: activeClassAssignedIds.length,
    assignedStudents: activeClassAssignedStudents
  } : null;
  const classes = courses.map(c => ({
    ...c,
    capacity: c.capacity || 30,
    assignedCount: enrollments.filter(e => e.courseId === c.id).length
  }));''',
    code
)

code = re.sub(
    r'  const unassignedStudents = students\.filter\(student => \{\n.*?  \}\);',
    r'''  const unassignedStudents = students.filter(student => {
    // Return students NOT in activeClassAssignedIds
    if (activeClassAssignedIds.includes(student.id)) return false;
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });''',
    code,
    flags=re.DOTALL
)

code = re.sub(
    r'  const handlePerformAllocation = \(\) => \{\n.*?  \};\n',
    r'''  const handlePerformAllocation = () => {
    if (selectedStudentIds.size === 0 || !selectedClassId || !activeClass) {
      onShowToast('Please select at least one student from the unassigned pool.', 'error');
      return;
    }
    const studentIds = Array.from(selectedStudentIds);
    if (activeClass.assignedCount + studentIds.length > activeClass.capacity) {
      onShowToast(`Operation aborted. Assignment exceeds the maximum capacity of ${activeClass.capacity} for this section.`, 'error');
      return;
    }
    assignStudentsToCourse(studentIds, selectedClassId);
    onShowToast(`Successfully allocated ${studentIds.length} students to ${activeClass.code}.`, 'success');
    setSelectedStudentIds(new Set());
  };
''',
    code,
    flags=re.DOTALL
)

code = re.sub(
    r'  const handleRemoveAssignment = \(studentId: string\) => \{\n.*?  \};',
    r'''  const handleRemoveAssignment = (studentId: string) => {
    if (!selectedClassId) return;
    removeStudentFromCourse(studentId, selectedClassId);
    onShowToast(`Released student from allocation draft.`, 'success');
  };''',
    code,
    flags=re.DOTALL
)

with open('src/components/admin/DualPanelAllocation.tsx', 'w') as f:
    f.write(code)

