export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  submissionFormat: 'text' | 'file';
  authorId: string;
  authorName: string;
  isPublic: boolean;
  tags: string[];
}

export interface Lesson {
  title: string;
  duration: string;
  content: string;
  assignment?: Assignment;
  quiz?: Quiz;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  thumbnailUrl: string;
  modules: Module[];
}

export type UserRole = 'student' | 'curator' | 'manager';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  groupId?: string; 
  notifications: Notification[];
}

export interface Group {
  id:string;
  name: string;
  curatorId: string;
  studentIds: string[];
  inviteCode: string;
}

export interface UserAssignment {
    id: string;
    assignment: Assignment;
    studentId: string;
    courseContext: string;
    status: 'assigned' | 'submitted' | 'reviewed';
    submission?: string;
    curatorFeedback?: string; // Explicit curator feedback
    nextStepSuggestion?: string;
    assignedDate: string;
    submittedDate?: string;
    reviewedDate?: string;
    dueDate: string;
}