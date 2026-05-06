/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import { Student } from '../types';

interface FeeManagementProps {
  students: Student[];
}

export default function FeeManagement({ students }: FeeManagementProps) {
  const allFees = students.flatMap(s => s.fees.map(f => ({ ...f, studentName: s.name, roll: s.rollNumber })));
  
  const totalDue = allFees.reduce((acc, f) => acc + (f.amount - f.paid), 0);
  const totalCollected = allFees.reduce((acc, f) => acc + f.paid, 0);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Fee Management</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Track payments, balances, and collection history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 text-sm">
          <Receipt className="w-5 h-5" />
          Generate Invoice
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Collected</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{totalCollected.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-bold mt-2">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Outstanding</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{totalDue.toLocaleString()}</p>
          <p className="text-xs text-orange-600 font-bold mt-2">Action required for 15 students</p>
        </div>
        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-500/20 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-blue-100 uppercase tracking-wider">Expected Revenue</p>
          </div>
          <p className="text-3xl font-bold">₹{(totalDue + totalCollected).toLocaleString()}</p>
          <p className="text-xs text-blue-100 font-bold mt-2">Target reached: 85%</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            <button className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allFees.slice(0, 10).map((fee, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{fee.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{fee.roll}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600">{fee.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">₹{fee.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Paid: ₹{fee.paid.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                      fee.status === 'Partial' ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500">{fee.dueDate}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
