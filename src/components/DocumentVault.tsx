/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Upload, Filter, CheckCircle2, Clock, MoreVertical, Eye, Download } from 'lucide-react';
import { Student } from '../types';

interface DocumentVaultProps {
  students: Student[];
}

export default function DocumentVault({ students }: DocumentVaultProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allDocs = students.flatMap(s => s.documents.map(d => ({ ...d, studentName: s.name, roll: s.rollNumber })));
  
  const filteredDocs = allDocs.filter(d => 
    d.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Document Vault</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Secure storage and verification of student records.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm group focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all w-full sm:flex-1 md:w-auto">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400 w-full md:w-48 xl:w-64"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 text-sm whitespace-nowrap">
            <Upload className="w-5 h-5" />
            Upload New
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocs.map((doc, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl ${
                doc.type === 'ID Card' ? 'bg-blue-50 text-blue-600' :
                doc.type === 'Admission Form' ? 'bg-purple-50 text-purple-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                <FileText className="w-8 h-8" />
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Uploaded for {doc.studentName}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                {doc.status === 'Verified' ? (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
