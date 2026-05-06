/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, GraduationCap } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Attendance from './components/Attendance';
import CourseManagement from './components/CourseManagement';
import AiAssistant from './components/AiAssistant';
import LoginPage from './components/LoginPage';
import FeeManagement from './components/FeeManagement';
import DocumentVault from './components/DocumentVault';
import HostelTransport from './components/HostelTransport';
import Settings from './components/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ViewType, Student } from './types';
import { MOCK_STUDENTS } from './constants';

function MainLayout() {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'students':
        return <StudentList students={students} setStudents={setStudents} />;
      case 'attendance':
        return <Attendance students={students} onSave={(updated) => setStudents(updated)} />;
      case 'fees':
        return <FeeManagement students={students} />;
      case 'documents':
        return <DocumentVault students={students} />;
      case 'hostel-transport':
        return <HostelTransport students={students} />;
      case 'classes':
        return <CourseManagement students={students} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col h-full">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">EduStream</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1">
          {renderView()}
        </div>
      </main>

      {(user?.role === 'Admin' || user?.role === 'Teacher') && (
        <AiAssistant students={students} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
