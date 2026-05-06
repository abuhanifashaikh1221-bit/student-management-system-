/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Plus, Search, Calendar, 
  MapPin, User, Clock, Trash2, 
  Filter, ChevronRight, GraduationCap, X,
  Briefcase, BookMarked
} from 'lucide-react';
import { Course, ClassSchedule, Student } from '../types';
import { MOCK_COURSES, MOCK_CLASSES } from '../constants';
import { useAuth } from '../context/AuthContext';

interface CourseManagementProps {
  students: Student[];
}

export default function CourseManagement({ students }: CourseManagementProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isTeacher = user?.role === 'Teacher';
  const isStudent = user?.role === 'Student';
  const canManage = isAdmin || isTeacher;

  const currentUserStudent = isStudent ? students.find(s => s.id === user?.studentId) : null;
  // Derive batch from roll number (e.g., CS2025001 -> Batch 2025)
  const studentBatch = currentUserStudent ? `Batch ${currentUserStudent.rollNumber.substring(2, 6)}` : null;

  const [activeTab, setActiveTab] = useState<'courses' | 'schedules' | 'my-courses'>(isStudent ? 'my-courses' : 'courses');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(MOCK_CLASSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSchedules = schedules.filter(s => 
    s.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mySchedules = schedules.filter(s => 
    s.batch === studentBatch && (currentUserStudent ? s.courseName.includes('') : false) // Simplified match for now
  );

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseId = formData.get('courseId') as string;
    const course = courses.find(c => c.id === courseId);
    
    const newSchedule: ClassSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: courseId,
      courseName: course?.name || 'Unknown Course',
      teacherName: user?.name || 'Administrator',
      roomNumber: formData.get('roomNumber') as string,
      day: formData.get('day') as any,
      time: formData.get('time') as string,
      batch: formData.get('batch') as string,
    };
    setSchedules(prev => [...prev, newSchedule]);
    setIsAddingSchedule(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Academic Catalog</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Curriculum management and session scheduling.</p>
        </div>
        <div className="flex w-full md:w-auto">
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 w-full md:w-auto">
            {isStudent && (
              <button 
                onClick={() => setActiveTab('my-courses')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'my-courses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                My Schedule
              </button>
            )}
            <button 
              onClick={() => setActiveTab('courses')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'courses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Courses
            </button>
            <button 
              onClick={() => setActiveTab('schedules')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'schedules' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {isStudent ? 'Sessions' : 'Schedules'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'courses' ? "Search courses by name or code..." : "Search schedules..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
        {canManage && (
          <button 
            onClick={() => activeTab === 'courses' ? setIsAddingCourse(true) : setIsAddingSchedule(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add New {activeTab === 'courses' ? 'Course' : 'Schedule'}
          </button>
        )}
      </div>

      {activeTab === 'courses' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div 
              layout
              key={course.id}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                  <BookMarked className="w-6 h-6" />
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-1 mb-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{course.code} • {course.department}</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{course.name}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-6">{course.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">{course.credits} Credits</span>
                </div>
                <button className="text-slate-400 group-hover:text-blue-500 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : activeTab === 'schedules' ? (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course & Batch</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room</th>
                {canManage && <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSchedules.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.courseName}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.batch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <User className="w-4 h-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">{item.teacherName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-700">{item.day}</span>
                       <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                         <Clock className="w-3 h-3" />
                         {item.time}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-slate-700">Room {item.roomNumber}</span>
                    </div>
                  </td>
                  {canManage && (
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeleteSchedule(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="bg-blue-600 rounded-[32px] p-8 text-white flex items-center justify-between shadow-xl shadow-blue-600/20">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Semester, {currentUserStudent?.name}!</h2>
                <p className="text-blue-100 font-medium">You are in {studentBatch} • {currentUserStudent?.department} Department</p>
              </div>
              <div className="bg-white/20 p-4 rounded-3xl">
                <GraduationCap className="w-10 h-10" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySchedules.length > 0 ? (
                mySchedules.map(schedule => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={schedule.id}
                    className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{schedule.roomNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{schedule.courseName}</h3>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-sm text-slate-500">
                         <User className="w-4 h-4 text-slate-400" />
                         <span>{schedule.teacherName}</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-slate-500">
                         <Calendar className="w-4 h-4 text-slate-400" />
                         <span>{schedule.day}, {schedule.time}</span>
                       </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                   <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-medium">No courses scheduled for your batch yet.</p>
                </div>
              )}
           </div>
        </div>
      )}

      <AnimatePresence>
        {isAddingCourse && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                <h2 className="text-xl font-bold">Add New Course</h2>
                <button onClick={() => setIsAddingCourse(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    <input className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm" placeholder="Course Name" />
                    <div className="grid grid-cols-2 gap-4">
                       <input className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm" placeholder="Course Code" />
                       <input className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm" placeholder="Credits" type="number" />
                    </div>
                    <textarea className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm min-h-[100px]" placeholder="Course Description" />
                 </div>
                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700">Save Course</button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddingSchedule && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                <h2 className="text-xl font-bold">Schedule Class Assignment</h2>
                <button onClick={() => setIsAddingSchedule(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSchedule} className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Course Assignment</label>
                      <select name="courseId" required className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none">
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Target Batch</label>
                        <select name="batch" required className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none">
                          <option value="Batch 2023">Batch 2023</option>
                          <option value="Batch 2024">Batch 2024</option>
                          <option value="Batch 2025">Batch 2025</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Room No.</label>
                        <input name="roomNumber" required className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" placeholder="e.g. 101" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Day</label>
                        <select name="day" required className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none">
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Time Slot</label>
                        <input name="time" required className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none" placeholder="09:00 AM" />
                      </div>
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                   Link Course to Schedule
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
