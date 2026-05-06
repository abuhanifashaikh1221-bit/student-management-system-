/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Check, X, RotateCcw, Save } from 'lucide-react';
import { Student } from '../types';

interface AttendanceProps {
  students: Student[];
  onSave: (students: Student[]) => void;
}

export default function Attendance({ students, onSave }: AttendanceProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const handleSave = () => {
    const updatedStudents = students.map(s => {
      if (attendanceData[s.id] === 'present') {
        const currentCount = (s.attendance / 100) * 100; // Simplified
        return { ...s, attendance: Math.min(100, s.attendance + 1) };
      }
      if (attendanceData[s.id] === 'absent') {
        return { ...s, attendance: Math.max(0, s.attendance - 1) };
      }
      return s;
    });
    onSave(updatedStudents);
  };

  const toggleAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance Tracking</h1>
          <p className="text-slate-500">Record and monitor student attendance for the daily sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Save className="w-5 h-5" />
            Save Attendance
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="flex-[2] px-2">Student Name</div>
          <div className="flex-1 px-2 text-center">Status Selection</div>
          <div className="flex-1 px-2 text-right">Quick Actions</div>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <div key={student.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors">
              <div className="flex-[2] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.department} • Year {student.year}</p>
                </div>
              </div>

              <div className="flex-1 flex justify-center items-center gap-2">
                <button
                  onClick={() => toggleAttendance(student.id, 'present')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    attendanceData[student.id] === 'present'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  Present
                </button>
                <button
                  onClick={() => toggleAttendance(student.id, 'absent')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    attendanceData[student.id] === 'absent'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                      : 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <X className="w-3.5 h-3.5" />
                  Absent
                </button>
                <button
                  onClick={() => toggleAttendance(student.id, 'late')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    attendanceData[student.id] === 'late'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Late
                </button>
              </div>

              <div className="flex-1 text-right italic text-xs text-slate-400 px-2">
                {attendanceData[student.id] ? `Marked as ${attendanceData[student.id]}` : 'Not marked yet'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
