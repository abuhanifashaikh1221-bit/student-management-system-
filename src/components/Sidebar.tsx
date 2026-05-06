/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Settings, 
  LogOut,
  GraduationCap,
  CreditCard,
  FileText,
  Bus,
  X,
  Compass
} from 'lucide-react';
import { ViewType, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard' as ViewType, label: 'Command Center', icon: LayoutDashboard, roles: ['Admin', 'Teacher', 'Student'], group: 'Operation' },
  { id: 'students' as ViewType, label: 'Student Directory', icon: Users, roles: ['Admin', 'Teacher'], group: 'Academic' },
  { id: 'classes' as ViewType, label: 'Academic Catalog', icon: BookOpen, roles: ['Admin', 'Teacher', 'Student'], group: 'Academic' },
  { id: 'attendance' as ViewType, label: 'Attendance', icon: CheckSquare, roles: ['Admin', 'Teacher'], group: 'Academic' },
  { id: 'fees' as ViewType, label: 'Fee Management', icon: CreditCard, roles: ['Admin', 'Student'], group: 'Logistics' },
  { id: 'documents' as ViewType, label: 'Document Vault', icon: FileText, roles: ['Admin', 'Teacher', 'Student'], group: 'Logistics' },
  { id: 'hostel-transport' as ViewType, label: 'Hostel & Transport', icon: Bus, roles: ['Admin', 'Teacher', 'Student'], group: 'Logistics' },
  { id: 'settings' as ViewType, label: 'System Settings', icon: Settings, roles: ['Admin', 'Teacher', 'Student'], group: 'System' },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || 'Student';

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));
  
  const groups = Array.from(new Set(filteredNavItems.map(item => item.group)));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-400 border-r border-slate-900 flex flex-col h-screen transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight block">EduStream</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Session 2025-26</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-900 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-6 mb-8">
          <div className="bg-white/5 border border-white/5 p-4 rounded-[24px] flex items-center gap-4 group transition-colors hover:bg-white/10">
            <div className="relative">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                className="w-11 h-11 rounded-xl bg-slate-800 p-1"
                alt="User"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Compass className="w-2.5 h-2.5 text-blue-500" />
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">{role} Portal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-8">
          {groups.map(group => (
            <div key={group} className="space-y-1">
              <p className="px-5 text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3">{group}</p>
              {filteredNavItems
                .filter(item => item.group === group)
                .map((item) => (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group ${
                      currentView === item.id 
                        ? 'bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)]' 
                        : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {currentView === item.id && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-2 w-1 h-5 bg-white rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 transition-colors duration-300 ${
                      currentView === item.id 
                        ? 'text-white' 
                        : 'text-slate-500 group-hover:text-blue-400'
                    }`} />
                    <span className={`text-sm font-bold tracking-tight transition-all duration-300 ${
                      currentView === item.id ? 'translate-x-1' : ''
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/5 mx-2">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">System Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
