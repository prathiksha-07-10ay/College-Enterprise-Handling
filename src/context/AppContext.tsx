import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  User,
  Course,
  Session,
  Subject,
  Staff,
  Student,
  AttendanceRecord,
  ExamResult,
  LeaveRequest,
  FeedbackThread,
  Notice,
} from '../types';
import {
  initialCourses,
  initialSessions,
  initialStaff,
  initialSubjects,
  initialStudents,
  generateInitialAttendance,
  initialResults,
  initialLeaves,
  initialFeedbackThreads,
  initialNotices,
  demoAccounts,
} from '../data/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

interface AppState {
  currentUser: User | null;
  theme: 'light' | 'dark';
  courses: Course[];
  sessions: Session[];
  subjects: Subject[];
  staff: Staff[];
  students: Student[];
  attendance: AttendanceRecord[];
  results: ExamResult[];
  leaves: LeaveRequest[];
  feedbackThreads: FeedbackThread[];
  notices: Notice[];
  notifications: AppNotification[];
  toasts: ToastItem[];
}

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_STAFF'; payload: Staff }
  | { type: 'UPDATE_STAFF'; payload: Staff }
  | { type: 'DELETE_STAFF'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'MARK_ATTENDANCE_BULK'; payload: AttendanceRecord[] }
  | { type: 'UPDATE_ATTENDANCE_RECORD'; payload: AttendanceRecord }
  | { type: 'SAVE_RESULT'; payload: ExamResult }
  | { type: 'APPLY_LEAVE'; payload: LeaveRequest }
  | { type: 'REVIEW_LEAVE'; payload: { id: string; status: 'approved' | 'rejected'; remarks?: string } }
  | { type: 'CREATE_FEEDBACK_THREAD'; payload: FeedbackThread }
  | { type: 'ADD_FEEDBACK_MESSAGE'; payload: { threadId: string; sender: User; message: string } }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_TOAST'; payload: ToastItem }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_DATA' };

const LOCAL_STORAGE_KEY = 'SIGCE_ERP_STORAGE_V2';

function loadInitialState(): AppState {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        toasts: [],
      };
    }
  } catch (e) {
    console.error('Failed to parse state from localStorage', e);
  }

  return {
    currentUser: demoAccounts['admin@admin.com'], // default to admin for preview, can switch anytime
    theme: 'light',
    courses: initialCourses,
    sessions: initialSessions,
    subjects: initialSubjects,
    staff: initialStaff,
    students: initialStudents,
    attendance: generateInitialAttendance(),
    results: initialResults,
    leaves: initialLeaves,
    feedbackThreads: initialFeedbackThreads,
    notices: initialNotices,
    notifications: [
      {
        id: 'n-1',
        title: 'New Leave Request',
        message: 'Aarav Patel has applied for 3 days academic leave for Smart India Hackathon.',
        timestamp: '15 mins ago',
        read: false,
        type: 'alert',
      },
      {
        id: 'n-2',
        title: 'Staff Faculty Feedback',
        message: 'Dr. Rajesh Sharma proposed AWS Cloud workshop for final year batches.',
        timestamp: '1 hour ago',
        read: false,
        type: 'info',
      },
      {
        id: 'n-3',
        title: 'Attendance Report Ready',
        message: 'Monthly attendance compilation for October 2026 is now available.',
        timestamp: 'Yesterday',
        read: true,
        type: 'success',
      },
    ],
    toasts: [],
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'ADD_STAFF':
      return { ...state, staff: [action.payload, ...state.staff] };

    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };

    case 'DELETE_STAFF':
      return {
        ...state,
        staff: state.staff.filter((s) => s.id !== action.payload),
      };

    case 'ADD_STUDENT':
      return { ...state, students: [action.payload, ...state.students] };

    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map((st) => (st.id === action.payload.id ? action.payload : st)),
      };

    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter((st) => st.id !== action.payload),
      };

    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, action.payload] };

    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };

    case 'DELETE_COURSE':
      return {
        ...state,
        courses: state.courses.filter((c) => c.id !== action.payload),
      };

    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] };

    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map((sub) => (sub.id === action.payload.id ? action.payload : sub)),
      };

    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter((sub) => sub.id !== action.payload),
      };

    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };

    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload),
      };

    case 'MARK_ATTENDANCE_BULK': {
      // Remove any existing records matching studentId, subjectId, date
      const keys = new Set(action.payload.map((r) => `${r.studentId}-${r.subjectId}-${r.date}`));
      const filtered = state.attendance.filter((r) => !keys.has(`${r.studentId}-${r.subjectId}-${r.date}`));
      return {
        ...state,
        attendance: [...filtered, ...action.payload],
      };
    }

    case 'UPDATE_ATTENDANCE_RECORD': {
      const exists = state.attendance.some((r) => r.id === action.payload.id);
      return {
        ...state,
        attendance: exists
          ? state.attendance.map((r) => (r.id === action.payload.id ? action.payload : r))
          : [action.payload, ...state.attendance],
      };
    }

    case 'SAVE_RESULT': {
      const existingIdx = state.results.findIndex(
        (r) => r.studentId === action.payload.studentId && r.subjectId === action.payload.subjectId
      );
      if (existingIdx >= 0) {
        const updated = [...state.results];
        updated[existingIdx] = action.payload;
        return { ...state, results: updated };
      }
      return { ...state, results: [action.payload, ...state.results] };
    }

    case 'APPLY_LEAVE':
      return {
        ...state,
        leaves: [action.payload, ...state.leaves],
      };

    case 'REVIEW_LEAVE': {
      const now = new Date().toISOString();
      return {
        ...state,
        leaves: state.leaves.map((l) =>
          l.id === action.payload.id
            ? {
                ...l,
                status: action.payload.status,
                reviewedAt: now,
                reviewerRemarks: action.payload.remarks || (action.payload.status === 'approved' ? 'Approved by HOD' : 'Rejected'),
              }
            : l
        ),
      };
    }

    case 'CREATE_FEEDBACK_THREAD':
      return {
        ...state,
        feedbackThreads: [action.payload, ...state.feedbackThreads],
      };

    case 'ADD_FEEDBACK_MESSAGE': {
      const now = new Date().toISOString();
      return {
        ...state,
        feedbackThreads: state.feedbackThreads.map((t) => {
          if (t.id !== action.payload.threadId) return t;
          const isSenderAdmin = action.payload.sender.role === 'admin';
          return {
            ...t,
            updatedAt: now,
            hasUnreadAdmin: !isSenderAdmin,
            hasUnreadUser: isSenderAdmin,
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                senderId: action.payload.sender.id,
                senderName: action.payload.sender.name,
                senderRole: action.payload.sender.role,
                message: action.payload.message,
                timestamp: now,
              },
            ],
          };
        }),
      };
    }

    case 'UPDATE_USER_PROFILE': {
      if (!state.currentUser) return state;
      const updatedUser = { ...state.currentUser, ...action.payload };
      return {
        ...state,
        currentUser: updatedUser,
      };
    }

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'RESET_DATA': {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return loadInitialState();
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  toggleTheme: () => void;
  showToast: (type: 'success' | 'error' | 'info', message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);

  // Sync to localStorage
  useEffect(() => {
    try {
      const toSave = { ...state, toasts: [] };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Sync dark class on documentElement
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const login = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const account = demoAccounts[trimmed];
    if (account) {
      dispatch({ type: 'SET_USER', payload: account });
      showToast('success', `Welcome back, ${account.name}!`, 'Authentication Successful');
      return true;
    }

    // Check if staff
    const staffMember = state.staff.find((s) => s.email.toLowerCase() === trimmed);
    if (staffMember) {
      const user: User = {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: 'staff',
        avatar: staffMember.avatar,
        phone: staffMember.phone,
        department: staffMember.department,
        designation: staffMember.designation,
      };
      dispatch({ type: 'SET_USER', payload: user });
      showToast('success', `Welcome back, ${staffMember.name}!`, 'Staff Portal');
      return true;
    }

    // Check if student
    const studentMember = state.students.find((st) => st.email.toLowerCase() === trimmed);
    if (studentMember) {
      const user: User = {
        id: studentMember.id,
        name: studentMember.name,
        email: studentMember.email,
        role: 'student',
        avatar: studentMember.avatar,
        phone: studentMember.phone,
        rollNo: studentMember.rollNo,
        courseId: studentMember.courseId,
        sessionId: studentMember.sessionId,
        semester: studentMember.semester,
        gender: studentMember.gender,
        address: studentMember.address,
      };
      dispatch({ type: 'SET_USER', payload: user });
      showToast('success', `Welcome back, ${studentMember.name}!`, 'Student Portal');
      return true;
    }

    showToast('error', 'Invalid email or credentials. Please use demo credentials.', 'Access Denied');
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    showToast('info', 'You have been logged out of SIGCE ERP.', 'Logged Out');
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message, title } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 4500);
  };

  const dismissToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        toggleTheme,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
