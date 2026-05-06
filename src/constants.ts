/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, User, SubjectScore, FeeRecord, StudentDocument } from './types';

const generateSubjects = (dept: string): SubjectScore[] => {
  const subjects = dept === 'CS' ? ['Algorithms', 'OS', 'DBMS'] :
                  dept === 'EC' ? ['Digital Circuits', 'Signals', 'Microprocessors'] :
                  dept === 'ME' ? ['Thermodynamics', 'Machines', 'Material Science'] :
                  dept === 'Civil' ? ['Structures', 'Geotech', 'Estimation'] :
                  ['Web Dev', 'Networking', 'Cloud Computing'];
  
  return subjects.map(s => ({
    subject: s,
    score: Math.floor(Math.random() * 40) + 60
  }));
};

const generateFees = (): FeeRecord[] => [
  { id: 'f1', type: 'Tuition', amount: 50000, paid: 45000, status: 'Partial', dueDate: '2025-09-30' },
  { id: 'f2', type: 'Hostel', amount: 25000, paid: 25000, status: 'Paid', dueDate: '2025-10-15' },
];

const generateDocs = (): StudentDocument[] => [
  { id: 'd1', name: 'Identity Card', type: 'ID Card', uploadedAt: '2025-08-20', status: 'Verified' },
  { id: 'd2', name: 'Admission Form', type: 'Admission Form', uploadedAt: '2025-08-20', status: 'Verified' },
];

const DEPARTMENTS: any[] = ['CS', 'EC', 'ME', 'Civil', 'IT'];
const NAMES = ['Alex', 'Sarah', 'Michael', 'Emma', 'James', 'Olivia', 'Ethan', 'Sophia', 'Liam', 'Ava', 'Noah', 'Isabella', 'William', 'Mia', 'Lucas', 'Charlotte', 'Mason', 'Amelia', 'Logan', 'Harper'];
const SURNAMES = ['Johnson', 'Williams', 'Chen', 'Davis', 'Wilson', 'Brown', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark'];

export const MOCK_STUDENTS: Student[] = Array.from({ length: 55 }).map((_, i) => {
  const dept = DEPARTMENTS[i % 5];
  const name = `${NAMES[i % NAMES.length]} ${SURNAMES[(i + 5) % SURNAMES.length]}`;
  return {
    id: `s${i + 1}`,
    name,
    rollNumber: `${dept}202${5 - (i % 4)}${String(i + 1).padStart(3, '0')}`,
    email: `${name.toLowerCase().replace(' ', '.')}@edu.com`,
    department: dept,
    year: (i % 4 + 1) as any,
    enrollmentDate: `202${5 - (i % 4)}-08-15`,
    status: Math.random() > 0.1 ? 'Active' : 'Inactive',
    attendance: Math.floor(Math.random() * 30) + 70,
    cgpa: parseFloat((Math.random() * 4 + 6).toFixed(2)),
    subjects: generateSubjects(dept),
    fees: generateFees(),
    documents: generateDocs(),
    hostel: { roomNumber: `${100 + i}`, block: i % 2 === 0 ? 'A' : 'B', status: 'Assigned' },
    transport: { route: 'North', busNumber: 'B12', pickupPoint: 'Main Gate', status: 'Opted' },
    role: 'Student'
  };
});

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'System Admin', email: 'admin@edu.com', role: 'Admin' },
  { id: 'u2', name: 'Prof. Julian Vane', email: 'teacher@edu.com', role: 'Teacher' },
  { id: 'u3', name: 'Alex Johnson', email: 'student@edu.com', role: 'Student', studentId: 's1' },
];

export const MOCK_CLASSES = [
  { id: 'c1', name: 'Advanced Mathematics', teacher: 'Dr. Thorne', schedule: 'Mon/Wed 09:00', room: '302', studentsCount: 24 },
  { id: 'c2', name: 'Data Structures', teacher: 'Prof. Smith', schedule: 'Tue/Thu 11:00', room: '105', studentsCount: 30 },
];
