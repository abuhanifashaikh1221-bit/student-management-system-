/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, User, Hash, Mail, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import { Student, Department, Year } from '../types';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
}

export default function StudentForm({ isOpen, onClose, onSubmit }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'CS' as Department,
    year: 1 as Year,
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Active' as const,
    attendance: 100,
    cgpa: 8.0,
    subjects: [] as { subject: string; score: number }[],
    fees: [] as any[],
    documents: [] as any[],
    role: 'Student' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-populate some defaults if empty
    const submissionData = {
      ...formData,
      subjects: formData.subjects.length > 0 ? formData.subjects : [
        { subject: 'Foundation Course', score: 85 }
      ],
      fees: [
        { id: 'f_new', type: 'Tuition', amount: 50000, paid: 0, status: 'Pending', dueDate: '2025-12-31' }
      ],
      documents: [],
    };
    onSubmit(submissionData as Omit<Student, 'id'>);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 overflow-y-auto pt-10 pb-20 flex justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden self-start"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Add New Student</h2>
                  <p className="text-slate-400 text-sm mt-1">Fill in the details to create a new profile.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Roll Number
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.rollNumber}
                      onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                      placeholder="e.g. CS2021001"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john.d@edu.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Enrollment Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Enrollment Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={e => setFormData({...formData, enrollmentDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value as Department})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="CS">Computer Science (CS)</option>
                      <option value="EC">Electronics (EC)</option>
                      <option value="ME">Mechanical (ME)</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="IT">Information Tech (IT)</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      Academic Year
                    </label>
                    <select
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: parseInt(e.target.value) as Year})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>

                  {/* CGPA */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Current CGPA
                    </label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={e => setFormData({...formData, cgpa: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Attendance */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Attendance (%)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={e => setFormData({...formData, attendance: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Student Data
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
