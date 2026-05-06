/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Attendance from './components/Attendance';
import AiAssistant from './components/AiAssistant';
import LoginPage from './components/LoginPage';
import FeeManagement from './components/FeeManagement';
import DocumentVault from './components/DocumentVault';
import HostelTransport from './components/HostelTransport';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ViewType, Student } from './types';
import { MOCK_STUDENTS } from './constants';

function MainLayout() {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
        return (
          <div className="p-8 text-center mt-20">
            <h1 className="text-2xl font-bold text-slate-800">Classes Calendar</h1>
            <p className="text-slate-500">Scheduled classes for 2025-26 Academic Year.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
            <p className="text-slate-500">Configure your system preferences.</p>
          </div>
        );
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto relative">
        {renderView()}
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
