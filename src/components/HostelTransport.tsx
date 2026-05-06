/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Bus, Home, MapPin, Users, Info, Settings, Shield } from 'lucide-react';
import { Student } from '../types';

interface HostelTransportProps {
  students: Student[];
}

export default function HostelTransport({ students }: HostelTransportProps) {
  const hostelStudents = students.filter(s => s.hostel?.status === 'Assigned');
  const transportStudents = students.filter(s => s.transport?.status === 'Opted');

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hostel & Transport</h1>
        <p className="text-slate-500 font-medium">Logistics management for resident and commuting students.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Hostel Management */}
        <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Hostel Block Management</h2>
                <p className="text-slate-400 text-sm font-medium">{hostelStudents.length} Students Resident</p>
              </div>
            </div>
            <button className="bg-slate-800 p-2.5 rounded-xl hover:bg-slate-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Block A (Boys)</p>
              <p className="text-2xl font-bold text-slate-900">42 / 50</p>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[84%] rounded-full" />
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Block B (Girls)</p>
              <p className="text-2xl font-bold text-slate-900">38 / 50</p>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[76%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 flex-1 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Recent Room Assignments
            </h3>
            <div className="space-y-3">
              {hostelStudents.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} 
                      className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1"
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="items-center text-sm font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Room {s.hostel?.roomNumber} • Block {s.hostel?.block}</p>
                    </div>
                  </div>
                  <button className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transport Management */}
        <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-blue-600 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Transport Fleet</h2>
                <p className="text-blue-100 text-sm font-medium">{transportStudents.length} Students Opted</p>
              </div>
            </div>
            <button className="bg-white/10 p-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <MapPin className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Active Routes & Capacity
              </h3>
              {['North Route - Bus B12', 'South Route - Bus S04', 'West Route - Bus W01'].map((route, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-bold text-slate-900">{route}</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">On Track</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-widest text-slate-400">
                    <span>Occupancy</span>
                    <span>{Math.floor(Math.random() * 20) + 15} / 40</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-blue-500 rounded-full`} style={{ width: `${Math.random() * 40 + 40}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
