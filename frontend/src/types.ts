export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Admin';
  avatarUrl?: string;
  createdAt?: string;
  isLocked?: boolean;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  status: 'Active' | 'Pending';
  avatarUrl?: string;
  gpa?: number;
  totalCredits?: number;
  grade?: string;
  isLocked?: boolean;
  phone?: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  coursesTaught: string[];
  avatarUrl?: string;
  status: 'Active' | 'On Leave';
  isLocked?: boolean;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  description: string;
  facultyCount: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  status: 'In Progress' | 'Midterms' | 'Completed';
  gpaContribution?: number;
  credits: number;
  capacity?: number;
  assignedCount?: number;
}

export interface ClassSession {
  id: string;
  courseId: string;
  title: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  room: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  status: 'Present' | 'Absent' | 'Late';
  timestamp: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  grade: string;
  score: number;
  remarks?: string;
  updatedAt: string;
}

export interface SystemStat {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  vsText: string;
  iconName: string;
  colorTheme: 'blue' | 'indigo' | 'violet' | 'cyan';
}

export interface ScheduleEvent {
  id: string;
  courseName: string;
  courseCode: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  room: string;
  instructor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'Student' | 'Faculty' | 'Admin';
  email: string;
  avatarUrl: string;
  phone?: string;
  gpa?: number;
  creditsCompleted?: number;
  totalCreditsNeeded?: number;
}
