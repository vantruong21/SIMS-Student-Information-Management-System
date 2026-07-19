import { Student, Course, ScheduleEvent, UserProfile } from './types';

export const DEFAULT_STUDENTS: Student[] = [];

export const DEFAULT_COURSES: Course[] = [
  { id: 'c-se1', code: 'SE101', name: 'Application Development', instructor: 'Dr. Smith', schedule: 'Mon/Wed 9:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-se2', code: 'SE102', name: 'Applied Programming and Design Principles', instructor: 'Dr. Jones', schedule: 'Tue/Thu 1:00 PM', status: 'In Progress', credits: 4 },
  { id: 'c-se3', code: 'SE103', name: 'Discrete Maths', instructor: 'Prof. Turing', schedule: 'Mon/Wed 2:00 PM', status: 'In Progress', credits: 3 },
  { id: 'c-mk1', code: 'MKT201', name: 'Digital Marketing Strategy', instructor: 'Prof. Miller', schedule: 'Tue/Thu 10:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-mk2', code: 'MKT202', name: 'Consumer Behavior', instructor: 'Dr. Davis', schedule: 'Mon/Wed 11:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-mk3', code: 'MKT203', name: 'Brand Management', instructor: 'Prof. Wilson', schedule: 'Fri 9:00 AM', status: 'In Progress', credits: 3 },
  { id: 'c-gd1', code: 'DES301', name: 'Typography Fundamentals', instructor: 'Prof. Carter', schedule: 'Mon/Wed 3:00 PM', status: 'In Progress', credits: 3 },
  { id: 'c-gd2', code: 'DES302', name: 'UI/UX Design', instructor: 'Dr. Lee', schedule: 'Tue/Thu 2:00 PM', status: 'In Progress', credits: 4 },
  { id: 'c-gd3', code: 'DES303', name: 'Color Theory', instructor: 'Prof. White', schedule: 'Fri 1:00 PM', status: 'In Progress', credits: 3 }
];

export const DEFAULT_SCHEDULE: ScheduleEvent[] = [];

export const STUDENT_PROFILE: UserProfile = {
  id: 'stu-1',
  name: 'John Doe',
  role: 'Student',
  email: 'scholar@elevate.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256',
  gpa: 0,
  creditsCompleted: 0,
  totalCreditsNeeded: 140
};

export const ADMIN_PROFILE: UserProfile = {
  id: 'admin-1',
  name: 'GS. Tran Hoang',
  role: 'Admin',
  email: 'admin@elevate.edu',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1nW0r0b5Mhu1d-72_6JqL8uTQopKz518YIviupE6f5RREs2Mw9Mh0hoX2tTXh4mx1nIS_MrOdp53iAE3wNj1inO3NR_XLfUOQZfXbAX8Dl80n8tsroJRzLY2tFrQLbb5x5uJ5rkXkrBD7Pp-mvi5RZjHMb7H_J81eVXaz6s1KEXDRMgxkvs8uKB5SZbd4PhNGqnF_yZTC7N0DkP0mUKhKY2raZH9AvM-ZGaPN3fQCEUHjEpQYW2jlw'
};

export const PROFESSOR_PROFILE: UserProfile = {
  id: 'fac-1',
  name: 'Richard Feynman',
  role: 'Faculty',
  email: 'feynman@elevate.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256'
};
