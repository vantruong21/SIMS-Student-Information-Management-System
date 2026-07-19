import re

with open('src/store/useAppStore.ts', 'r') as f:
    code = f.read()

code = code.replace(
    "import { Student, Faculty, Course, ScheduleEvent, UserProfile, ClassSession } from '../types';",
    "import { Student, Faculty, Course, ScheduleEvent, UserProfile, ClassSession } from '../types';\nimport { DEFAULT_COURSES } from '../mockData';"
)

code = code.replace(
    "  courses: [],",
    "  courses: DEFAULT_COURSES,"
)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(code)

with open('src/mockData.ts', 'r') as f:
    code = f.read()

courses_data = """export const DEFAULT_COURSES: Course[] = [
  { id: 'c-se1', code: 'SE101', name: 'Application Development', instructor: 'Dr. Smith', schedule: 'Mon/Wed 9:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-se2', code: 'SE102', name: 'Applied Programming and Design Principles', instructor: 'Dr. Jones', schedule: 'Tue/Thu 1:00 PM', status: 'In Progress', credits: 4 },
  { id: 'c-se3', code: 'SE103', name: 'Discrete Maths', instructor: 'Prof. Turing', schedule: 'Mon/Wed 2:00 PM', status: 'In Progress', credits: 3 },
  { id: 'c-mk1', code: 'MKT201', name: 'Digital Marketing Strategy', instructor: 'Prof. Miller', schedule: 'Tue/Thu 10:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-mk2', code: 'MKT202', name: 'Consumer Behavior', instructor: 'Dr. Davis', schedule: 'Mon/Wed 11:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-mk3', code: 'MKT203', name: 'Brand Management', instructor: 'Prof. Wilson', schedule: 'Fri 9:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-gd1', code: 'DES301', name: 'Typography Fundamentals', instructor: 'Prof. Carter', schedule: 'Mon/Wed 3:00 PM', status: 'In Progress', credits: 3 },
  { id: 'c-gd2', code: 'DES302', name: 'UI/UX Design', instructor: 'Dr. Lee', schedule: 'Tue/Thu 2:00 PM', status: 'In Progress', credits: 4 },
  { id: 'c-gd3', code: 'DES303', name: 'Color Theory', instructor: 'Prof. White', schedule: 'Fri 1:00 PM', status: 'In Progress', credits: 3 }
];"""

code = re.sub(
    r'export const DEFAULT_COURSES: Course\[\] = \[\];',
    courses_data,
    code
)

with open('src/mockData.ts', 'w') as f:
    f.write(code)
