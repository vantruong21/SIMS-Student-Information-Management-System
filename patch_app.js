const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { useAuthStore } from './store/useAuthStore';",
  "import { useAuthStore } from './store/useAuthStore';\nimport { useAppStore } from './store/useAppStore';"
);

code = code.replace(
  "  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);",
  "  const students = useAppStore(state => state.students);"
);
code = code.replace(
  "  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);",
  "  const courses = useAppStore(state => state.courses);"
);
code = code.replace(
  "  const [schedule, setSchedule] = useState<ScheduleEvent[]>(DEFAULT_SCHEDULE);",
  "  const schedule = [] as ScheduleEvent[]; // We will derive schedule later"
);

fs.writeFileSync('src/App.tsx', code);
