/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  TrendingUp, Users, BookOpen, GraduationCap, 
  ArrowUpRight, BarChart3, Clock, Zap, 
  Target, Award, Calendar, CheckCircle2,
  ChevronRight, Plus
} from 'lucide-react';
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
    { label: 'Total Students', value: totalStudents, change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Learners', value: activeStudents, change: '+5%', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg CGPA', value: avgCGPA, change: '+0.4', icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, change: '+8%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative overflow-hidden">
      {/* Subtle Mesh Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/5 blur-[120px] -z-10 rounded-full" />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Control Center</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">Performance Command</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time academic signals for Session 2025-26</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-2 rounded-xl">
             <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Session</p>
            <p className="text-sm font-bold text-slate-900">May 15, 2025 • Week 32</p>
          </div>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  {stat.change}
                  <TrendingUp className="w-3 h-3" />
                </span>
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-mono font-medium text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-0 opacity-50" />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrollment Distribution - Bento Column Span 2 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2.5 rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Enrollment Dynamics</h2>
                <p className="text-xs text-slate-400 font-medium">Student distribution across active departments</p>
              </div>
            </div>
            <button className="text-blue-600 font-bold text-xs hover:underline flex items-center gap-1">
              Deep Analytics <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex ring-8 ring-slate-50">
              {(Object.keys(deptData) as Department[]).map((dept) => {
                const width = (deptData[dept] / totalStudents) * 100;
                return (
                  <motion.div 
                    key={dept} 
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    className={`${deptColors[dept]} h-full transition-all duration-1000 relative group/segment`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover/segment:opacity-100 transition-opacity whitespace-nowrap z-10 font-mono">
                      {dept}: {width.toFixed(1)}%
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
              {(Object.keys(deptData) as Department[]).map((dept) => (
                <div key={dept} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <div className={`w-2 h-2 rounded-full ${deptColors[dept]} mb-2`} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dept}</p>
                  <p className="text-lg font-mono font-medium text-slate-900">{deptData[dept]}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Bento Item 1 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -z-0" />
          <div className="relative z-10 flex justify-between items-start">
             <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <Zap className="w-6 h-6 text-blue-400" />
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System</p>
                <p className="text-xs text-blue-400 font-bold">Priority Actions</p>
             </div>
          </div>
          
          <div className="relative z-10 mt-12 space-y-4">
             <h2 className="text-2xl font-bold leading-tight">System<br />Ready for Input</h2>
             <div className="grid grid-cols-2 gap-3">
                <button className="bg-white/10 hover:bg-white text-white hover:text-slate-900 p-4 rounded-2xl transition-all duration-300 flex flex-col gap-3 group/btn">
                   <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                     <Plus className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-xs font-bold">Log New Student</span>
                </button>
                <button className="bg-white/10 hover:bg-white text-white hover:text-slate-900 p-4 rounded-2xl transition-all duration-300 flex flex-col gap-3 group/btn">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                   <span className="text-xs font-bold">Attendance Check</span>
                </button>
             </div>
          </div>
        </motion.div>

        {/* Recent Honors & Top Performers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 p-2.5 rounded-xl">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Recent Honors</h2>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-6 flex-1">
            {students.slice(0, 4).map((student, idx) => (
              <div key={student.id} className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" />
                  </div>
                  {idx === 0 && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-lg">
                      <Target className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{student.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest">{student.department.toUpperCase()} • {student.rollNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-medium text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
                    {student.cgpa}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Milestone Tracker - Bento Item */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white overflow-hidden relative group"
        >
          {/* Decorative Circle */}
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full transition-transform group-hover:scale-110 duration-1000" />
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="text-2xl font-bold mb-2">Academic Pulse</h2>
                  <p className="text-blue-100/80 text-sm font-medium">Session completion and upcoming certification deadlines</p>
               </div>
               <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                 <Clock className="w-6 h-6" />
               </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Spring Semester Completion</span>
                        <span>74%</span>
                     </div>
                     <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '74%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-white"
                        />
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-white/10 p-4 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Days Left</p>
                        <p className="text-2xl font-mono">14</p>
                     </div>
                     <div className="flex-1 bg-white/10 p-4 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Active Exams</p>
                        <p className="text-2xl font-mono text-amber-400">03</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-3xl text-slate-900 shadow-xl shadow-blue-900/20 scale-105 origin-right">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-xs font-bold">End Sem Submission</p>
                        <p className="text-[10px] text-slate-400">Due in 48 Hours</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                     <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                     </div>
                     <div>
                        <p className="text-xs font-bold">Lab Certification</p>
                        <p className="text-[10px] text-blue-200">Session 2025 Block</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
