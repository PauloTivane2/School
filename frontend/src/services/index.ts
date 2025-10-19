export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'guardian' | 'accountant';
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  academicYear: string;
  teacherId?: string;
}

export interface Guardian {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
  observation?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  trimester: 1 | 2 | 3;
  mac?: number;
  pp?: number;
  pt?: number;
  average: number;
}

export interface Exam {
  id: string;
  studentId: string;
  examType: '3' | '6' | '9' | '12';
  year: number;
  fee: number;
  status: 'pending' | 'paid' | 'registered';
  subjects: string[];
}