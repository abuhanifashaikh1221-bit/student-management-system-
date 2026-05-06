/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
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
  Bus
} from 'lucide-react';
import { ViewType, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems = [
  { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Teacher', 'Student'] },
  { id: 'students' as ViewType, label: 'Students', icon: Users, roles: ['Admin', 'Teacher'] },
  { id: 'classes' as ViewType, label: 'Classes', icon: BookOpen, roles: ['Admin', 'Teacher', 'Student'] },
  { id: 'attendance' as ViewType, label: 'Attendance', icon: CheckSquare, roles: ['Admin', 'Teacher'] },
  { id: 'fees' as ViewType, label: 'Fee Management', icon: CreditCard, roles: ['Admin', 'Student'] },
  { id: 'documents' as ViewType, label: 'Document Vault', icon: FileText, roles: ['Admin', 'Teacher', 'Student'] },
  { id: 'hostel-transport' as ViewType, label: 'Hostel & Transport', icon: Bus, roles: ['Admin', 'Teacher', 'Student'] },
  { id: 'settings' as ViewType, label: 'Settings', icon: Settings, roles: ['Admin', 'Teacher', 'Student'] },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = user?.role || 'Student';

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight block">EduStream</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Session 2025-26</span>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
            className="w-10 h-10 rounded-xl bg-slate-700 p-1"
            alt="User"
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
