export type UserRole = 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  department?: string;
  designation?: string;
  // student specific
  rollNo?: string;
  courseId?: string;
  sessionId?: string;
  semester?: number;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  durationYears: number;
  totalSemesters: number;
  intakeCapacity: number;
  hodName: string;
}

export interface Session {
  id: string;
  name: string; // e.g. "2024–2028"
  startYear: number;
  endYear: number;
  isCurrent: boolean;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  courseId: string;
  staffId: string; // faculty in charge
  semester: number;
  credits: number;
  weeklyHours: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  designation: string;
  department: string;
  phone: string;
  joiningDate: string;
  qualification: string;
  avatar: string;
  assignedSubjectIds: string[];
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  courseId: string;
  sessionId: string;
  semester: number;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  avatar: string;
  admissionDate: string;
  guardianName: string;
  guardianPhone: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  sessionId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent';
  markedByStaffId: string;
  markedAt: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  subjectId: string;
  semester: number;
  assignmentMarks: number; // Max 20
  midTermMarks: number;     // Max 30
  endSemMarks: number;      // Max 50
  totalMarks: number;       // Max 100
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  gradePoint: number;
  credits: number;
  publishedDate: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string; // studentId or staffId
  applicantType: 'student' | 'staff';
  applicantName: string;
  applicantRole: UserRole;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  type: 'Medical' | 'Casual' | 'Academic' | 'Duty' | 'Personal';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewerRemarks?: string;
}

export interface FeedbackMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

export interface FeedbackThread {
  id: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: 'student' | 'staff';
  subject: string;
  category: 'Academic' | 'Infrastructure' | 'Curriculum' | 'Administration' | 'Other';
  messages: FeedbackMessage[];
  createdAt: string;
  updatedAt: string;
  hasUnreadAdmin: boolean;
  hasUnreadUser: boolean;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  targetRole: 'all' | 'staff' | 'student';
  priority: 'low' | 'medium' | 'high';
  publishedDate: string;
  author: string;
}
