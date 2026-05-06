/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bus, Home, MapPin, Users, Info, Settings, Shield, Plus, Trash2, Phone, User as UserIcon, X, Clock } from 'lucide-react';
import { Student, TransportRoute, PickupPoint } from '../types';
import { MOCK_ROUTES } from '../constants';
import { useAuth } from '../context/AuthContext';

interface HostelTransportProps {
  students: Student[];
}

export default function HostelTransport({ students }: HostelTransportProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [routes, setRoutes] = useState<TransportRoute[]>(MOCK_ROUTES);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);

  const hostelStudents = students.filter(s => s.hostel?.status === 'Assigned');
  const transportStudents = students.filter(s => s.transport?.status === 'Opted');

  const handleDeleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
  };

  const handleAddRoute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoute: TransportRoute = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      busNumber: formData.get('busNumber') as string,
      driverName: formData.get('driverName') as string,
      driverPhone: formData.get('driverPhone') as string,
      capacity: parseInt(formData.get('capacity') as string),
      status: 'Active',
      pickupPoints: [],
    };
    setRoutes(prev => [...prev, newRoute]);
    setIsAddingRoute(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">Hostel & Transport</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Logistics management for resident and commuting students.</p>
        </div>
        {isAdmin && (
          <div className="flex w-full md:w-auto">
             <button 
              onClick={() => setIsAddingRoute(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Define New Route
            </button>
          </div>
        )}
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
            {isAdmin && (
              <button className="bg-slate-800 p-2.5 rounded-xl hover:bg-slate-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            )}
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

          <div className="px-8 pb-8 flex-1 overflow-y-auto max-h-[400px]">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Recent Room Assignments
            </h3>
            <div className="space-y-3">
              {hostelStudents.slice(0, 8).map((s, i) => (
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

          <div className="p-8 flex-1 overflow-y-auto max-h-[700px] space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Active Routes & Capacity Control
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {routes.map((route) => (
                  <div key={route.id} className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          {route.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                            {route.status}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Bus: {route.busNumber} • Capacity: {route.capacity}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedRoute(route)}
                            className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRoute(route.id)}
                            className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{route.driverName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{route.driverPhone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pickup Points</p>
                      <div className="flex flex-wrap gap-2">
                        {route.pickupPoints.map((p) => (
                          <div key={p.id} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-bold text-slate-700">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isAddingRoute && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-600 text-white">
                <h2 className="text-xl font-bold">Define Transport Route</h2>
                <button onClick={() => setIsAddingRoute(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddRoute} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Route Name</label>
                    <input name="name" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. West Coast" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Bus Number</label>
                    <input name="busNumber" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. B-990" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Driver Name</label>
                    <input name="driverName" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Driver Phone</label>
                    <input name="driverPhone" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Capacity</label>
                  <input name="capacity" type="number" defaultValue="40" required className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                  Save Route
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {selectedRoute && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                <h2 className="text-xl font-bold">Edit Pickup Points: {selectedRoute.name}</h2>
                <button onClick={() => setSelectedRoute(null)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                   {selectedRoute.pickupPoints.map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                           <MapPin className="w-4 h-4 text-blue-500" />
                           <div>
                             <p className="text-sm font-bold text-slate-900">{p.name}</p>
                             <p className="text-xs text-slate-500">{p.time}</p>
                           </div>
                         </div>
                         <button className="text-red-400 hover:text-red-600">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   ))}
                </div>
                <div className="pt-4 border-t border-slate-100 flex gap-2">
                   <input className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm" placeholder="New point name" />
                   <input className="w-24 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm" placeholder="Time" />
                   <button className="bg-blue-600 text-white p-2.5 rounded-xl">
                     <Plus className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
