import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "  const schedule = [] as ScheduleEvent[];",
    """  const enrollments = useAppStore(state => state.enrollments);
  const user = useAuthStore(state => state.user);
  
  const schedule = courses
    .filter(c => enrollments.some(e => e.courseId === c.id && e.studentId === user?.id))
    .map((c, idx) => {
       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
       return {
         id: `evt-${idx}`,
         courseName: c.name,
         courseCode: c.code,
         day: days[idx % days.length] as ScheduleEvent['day'],
         time: '09:00 AM - 10:30 AM',
         room: 'Room ' + (100 + idx),
         instructor: c.instructor
       }
    });"""
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

