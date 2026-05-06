/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, User, SubjectScore, FeeRecord, StudentDocument, Course, TransportRoute, ClassSchedule } from './types';

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

export const MOCK_COURSES: Course[] = [
  { id: 'crs1', code: 'CS101', name: 'Introduction to Programming', department: 'CS', credits: 4, description: 'Basic programming concepts using Python.' },
  { id: 'crs2', code: 'CS201', name: 'Data Structures and Algorithms', department: 'CS', credits: 4, description: 'Advanced programming, stacks, queues, trees, and logic.' },
  { id: 'crs3', code: 'EC101', name: 'Digital logic Design', department: 'EC', credits: 3, description: 'Basic circuits and transistors.' },
  { id: 'crs4', code: 'ME102', name: 'Thermodynamics', department: 'ME', credits: 4, description: 'Laws of thermodynamics and energy systems.' },
];

export const MOCK_ROUTES: TransportRoute[] = [
  {
    id: 'r1',
    name: 'North Route',
    busNumber: 'B12-4455',
    driverName: 'Robert Wilson',
    driverPhone: '+1-555-0102',
    capacity: 40,
    status: 'Active',
    pickupPoints: [
      { id: 'p1', name: 'Main Gate', time: '08:00 AM' },
      { id: 'p2', name: 'Oak Street', time: '08:15 AM' },
      { id: 'p3', name: 'Park Avenue', time: '08:30 AM' },
    ]
  },
  {
    id: 'r2',
    name: 'South Route',
    busNumber: 'S04-9911',
    driverName: 'Sarah Smith',
    driverPhone: '+1-555-0199',
    capacity: 35,
    status: 'Active',
    pickupPoints: [
      { id: 'p4', name: 'River Dale', time: '07:45 AM' },
      { id: 'p5', name: 'Central Mall', time: '08:10 AM' },
    ]
  }
];

export const MOCK_CLASSES: ClassSchedule[] = [
  { id: 'c1', courseId: 'crs1', courseName: 'Introduction to Programming', teacherName: 'Dr. Thorne', roomNumber: '302', day: 'Monday', time: '09:00 AM', batch: 'Batch 2025' },
  { id: 'c2', courseId: 'crs2', courseName: 'Data Structures', teacherName: 'Prof. Smith', roomNumber: '105', day: 'Tuesday', time: '11:00 AM', batch: 'Batch 2024' },
  { id: 'c3', courseId: 'crs3', courseName: 'Digital logic Design', teacherName: 'Prof. Alan', roomNumber: '201', day: 'Wednesday', time: '10:00 AM', batch: 'Batch 2025' },
];
