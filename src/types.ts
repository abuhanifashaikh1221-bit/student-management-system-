/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Department = 'CS' | 'EC' | 'ME' | 'Civil' | 'IT';
export type Year = 1 | 2 | 3 | 4;
export type UserRole = 'Admin' | 'Teacher' | 'Student';

export interface SubjectScore {
  subject: string;
  score: number;
}

export interface FeeRecord {
  id: string;
  type: 'Tuition' | 'Hostel' | 'Transport' | 'Exam';
  amount: number;
  paid: number;
  status: 'Paid' | 'Partial' | 'Pending';
  dueDate: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: 'ID Card' | 'Admission Form' | 'Certificate';
  uploadedAt: string;
  status: 'Verified' | 'Pending';
}

export interface HostelInfo {
  roomNumber: string;
  block: string;
  status: 'Assigned' | 'Not Assigned';
}

export interface TransportInfo {
  route: string;
  busNumber: string;
  pickupPoint: string;
  status: 'Opted' | 'Not Opted';
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  department: Department;
  year: Year;
  enrollmentDate: string;
  status: 'Active' | 'Inactive';
  attendance: number;
  cgpa: number;
  avatar?: string;
  subjects: SubjectScore[];
  fees: FeeRecord[];
  documents: StudentDocument[];
  hostel?: HostelInfo;
  transport?: TransportInfo;
  role: UserRole;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string; // If role is 'Student'
}

export type ViewType = 'dashboard' | 'students' | 'classes' | 'attendance' | 'fees' | 'documents' | 'hostel-transport' | 'settings';
