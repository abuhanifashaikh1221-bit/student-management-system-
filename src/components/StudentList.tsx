/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, List, Grid, Filter, 
  MoreVertical, Trash2, Edit, ChevronDown,
  ArrowUpDown, Check, X, ShieldAlert,
  ChevronRight, Calendar, CheckCircle2,
  Download, BookOpen, Star, CreditCard
} from 'lucide-react';
import { Student, Department, Year } from '../types';
import StudentForm from './StudentForm';

type SortKey = keyof Student;

interface StudentListProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function StudentList({ students, setStudents }: StudentListProps) {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [yearFilter, setYearFilter] = useState<Year | 'All'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddStudent = (newData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStudents(prev => [newStudent, ...prev]);
    showNotification(`Student ${newStudent.name} added successfully!`);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Roll Number', 'Email', 'Department', 'Year', 'CGPA', 'Attendance', 'Status'];
    const rows = filteredStudents.map(s => [
      s.name, s.rollNumber, s.email, s.department, s.year, s.cgpa, s.attendance, s.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Student Directory exported to CSV!');
  };

  // Filtering Logic
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesSearch = 
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === 'All' || s.department === deptFilter;
        const matchesYear = yearFilter === 'All' || s.year === yearFilter;
        return matchesSearch && matchesDept && matchesYear;
      })
      .sort((a, b) => {
        const valA = a[sortKey] ?? '';
        const valB = b[sortKey] ?? '';
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        
        return sortOrder === 'asc' 
          ? String(valA).localeCompare(String(valB)) 
          : String(valB).localeCompare(String(valA));
      });
  }, [students, searchTerm, deptFilter, yearFilter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) 
      ? prev.filter(i => i !== id) 
      : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const deleteStudents = (ids: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} student(s)?`)) {
      setStudents(prev => prev.filter(s => !ids.includes(s.id)));
      setSelectedIds([]);
    }
  };

  const getCGPAColor = (cgpa: number) => {
    if (cgpa >= 9) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (cgpa >= 7) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 85) return 'bg-emerald-500';
    if (attendance >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 font-medium">Manage and monitor academic performance tracks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Student
          </button>
        </div>
      </header>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-slate-900 p-6 text-white flex items-center gap-4 relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`} 
                  alt="" 
                  className="w-16 h-16 rounded-2xl bg-blue-600 p-2"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-slate-400 text-sm font-medium">{selectedStudent.rollNumber} • {selectedStudent.department}</p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Year</p>
                    <p className="text-base font-bold text-slate-900">Year {selectedStudent.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedStudent.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                    <p className="text-base font-bold text-slate-900">{selectedStudent.attendance}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current CGPA</p>
                    <p className="text-base font-bold text-blue-600">{selectedStudent.cgpa.toFixed(2)} / 10.0</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-4 border-t border-slate-100">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    Fees & Logistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fee Status</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedStudent.fees[0]?.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {selectedStudent.fees[0]?.status || 'N/A'}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hostel Room</p>
                      <p className="text-xs font-bold text-slate-900">{selectedStudent.hostel?.roomNumber || 'None'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-4 border-t border-slate-100">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Subject Wise Performance
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent.subjects.map((sub) => (
                      <div key={sub.subject} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">{sub.subject}</span>
                          <span className="text-slate-900">{sub.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${sub.score}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <StudentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddStudent} 
      />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value as Department | 'All')}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              <option value="All">All Departments</option>
              <option value="CS">CS - Computer Science</option>
              <option value="EC">EC - Electronics</option>
              <option value="ME">ME - Mechanical</option>
              <option value="Civil">Civil Engineering</option>
              <option value="IT">IT - Information Tech</option>
            </select>

            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              <option value="All">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('table')}
                className={`p-1.5 rounded-lg transition-all ${view === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {view === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 w-10">
                      <button 
                        onClick={toggleAll}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          selectedIds.length === filteredStudents.length && filteredStudents.length > 0
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {selectedIds.length === filteredStudents.length && filteredStudents.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    </th>
                    {[
                      { key: 'name', label: 'Student' },
                      { key: 'rollNumber', label: 'Roll No' },
                      { key: 'department', label: 'Department' },
                      { key: 'year', label: 'Year' },
                      { key: 'cgpa', label: 'CGPA' },
                      { key: 'attendance', label: 'Attendance' },
                    ].map((col) => (
                      <th 
                        key={col.key}
                        className="px-6 py-4 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort(col.key as SortKey)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className={`w-3 h-3 ${sortKey === col.key ? 'text-blue-600' : 'opacity-30'}`} />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      onClick={() => setSelectedStudent(student)}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${selectedIds.includes(student.id) ? 'bg-blue-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelect(student.id); }}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            selectedIds.includes(student.id)
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {selectedIds.includes(student.id) && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                            alt="" 
                            className="w-8 h-8 rounded-full bg-blue-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">{student.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{student.rollNumber}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{student.department}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">Year {student.year}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getCGPAColor(student.cgpa)}`}>
                          {student.cgpa.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${getAttendanceColor(student.attendance)}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{student.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-blue-600 transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteStudents([student.id])}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                onClick={() => setSelectedStudent(student)}
                className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer ${
                  selectedIds.includes(student.id) 
                    ? 'border-blue-500 shadow-lg ring-1 ring-blue-500/20 bg-blue-50/10' 
                    : 'border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} 
                        alt="" 
                        className="w-12 h-12 rounded-2xl bg-blue-50 p-1"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelect(student.id); }}
                        className={`absolute -top-2 -left-2 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          selectedIds.includes(student.id)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {selectedIds.includes(student.id) && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{student.name}</h3>
                      <p className="text-xs text-slate-400">{student.rollNumber}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${getCGPAColor(student.cgpa)}`}>
                    GPA {student.cgpa.toFixed(1)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Year {student.year} • {student.department}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {student.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                      <span>Attendance</span>
                      <span className={student.attendance < 75 ? 'text-red-500' : 'text-slate-700'}>{student.attendance}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getAttendanceColor(student.attendance)}`}
                        style={{ width: `${student.attendance}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium italic">Enrolled: {student.enrollmentDate}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteStudents([student.id])}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No students found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            We couldn't find any students matching your current search or filter criteria.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setDeptFilter('All'); setYearFilter('All'); }}
            className="mt-6 text-blue-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
