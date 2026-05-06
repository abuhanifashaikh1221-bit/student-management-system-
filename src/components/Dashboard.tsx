/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TrendingUp, Users, BookOpen, GraduationCap, ArrowUpRight, BarChart3, Clock } from 'lucide-react';
import { MOCK_CLASSES } from '../constants';
import { Department, Student } from '../types';

interface DashboardProps {
  students: Student[];
}

export default function Dashboard({ students }: DashboardProps) {
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const avgCGPA = (students.reduce((acc, s) => acc + s.cgpa, 0) / totalStudents).toFixed(2);
  const avgAttendance = (students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents).toFixed(0);

  const stats = [
    { label: 'Total Students', value: totalStudents, change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Learners', value: activeStudents, change: '+5%', icon: BookOpen, color: 'bg-emerald-500' },
    { label: 'Avg CGPA', value: avgCGPA, change: '+0.4', icon: GraduationCap, color: 'bg-amber-500' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, change: '+8%', icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  const deptData: Record<Department, number> = {
    'CS': students.filter(s => s.department === 'CS').length,
    'EC': students.filter(s => s.department === 'EC').length,
    'ME': students.filter(s => s.department === 'ME').length,
    'Civil': students.filter(s => s.department === 'Civil').length,
    'IT': students.filter(s => s.department === 'IT').length,
  };

  const deptColors: Record<Department, string> = {
    'CS': 'bg-blue-500',
    'EC': 'bg-purple-500',
    'ME': 'bg-orange-500',
    'Civil': 'bg-emerald-500',
    'IT': 'bg-indigo-500',
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Academic session 2025-26 Performance Snapshot</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block mb-1 tracking-widest uppercase">Live System</p>
          <p className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-end">
            <Clock className="w-4 h-4 text-slate-400" />
            May 15, 2025 • 10:45 AM
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dept Distribution Strip */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-900" />
          <h2 className="text-lg font-bold text-slate-900">Enrollment by Department</h2>
        </div>
        <div className="h-6 w-full bg-slate-50 rounded-full overflow-hidden flex ring-4 ring-slate-50">
          {(Object.keys(deptData) as Department[]).map((dept) => {
            const width = (deptData[dept] / totalStudents) * 100;
            return (
              <motion.div 
                key={dept} 
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                className={`${deptColors[dept]} h-full transition-all duration-1000`} 
                title={`${dept}: ${deptData[dept]} students`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {(Object.keys(deptData) as Department[]).map((dept) => (
            <div key={dept} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-lg ${deptColors[dept]}`} />
              <span className="text-sm font-bold text-slate-700">{dept}</span>
              <span className="text-sm text-slate-400 font-medium">{deptData[dept]} students</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Honors</h2>
          <div className="space-y-4">
            {students.slice(0, 4).map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.rollNumber} • {student.department}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    G: {student.cgpa}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Exam Calendar</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border-l-4 border-l-blue-500 bg-blue-50/20">
              <p className="text-sm font-bold text-slate-900">End Semester - Batch 2025</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Aug 18, 2025 • Hall 02</p>
            </div>
            <div className="p-5 rounded-2xl border-l-4 border-l-emerald-500 bg-emerald-50/20">
              <p className="text-sm font-bold text-slate-900">Lab Certification - Cloud Dev</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Aug 22, 2025 • CS Lab 1</p>
            </div>
            <div className="p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/20">
              <p className="text-sm font-bold text-slate-900">Hostel Allocation Deadline</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Sep 01, 2025 • Admin Block</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
