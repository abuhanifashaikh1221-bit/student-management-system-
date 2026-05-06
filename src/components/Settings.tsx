/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Shield, Bell, Palette, 
  LogOut, Save, Camera, Globe, 
  Lock, Mail, Smartphone, Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'system'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System Prefs', icon: Palette },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">System Settings</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Manage account preferences and global configurations.</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-all active:scale-95 text-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </header>

      <div className="flex bg-slate-100 p-1.5 rounded-[28px] overflow-x-auto no-scrollbar gap-1 w-full md:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm p-6 md:p-10">
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-50 text-center sm:text-left">
              <div className="relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 ring-8 ring-blue-50 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{user?.name}</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <p className="text-blue-600 font-bold text-[10px] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">{user?.role} Portal</p>
                  <p className="text-slate-400 text-xs font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    defaultValue={user?.name}
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    defaultValue={user?.email}
                    className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Security & Access</h2>
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                    <p className="text-xs text-slate-500">Update your account password regularly.</p>
                  </div>
                </div>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Update</button>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your portal.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Real-time Alerts</h2>
            <div className="space-y-4">
              {['Academic Announcements', 'Fee Deadlines', 'Attendance Alerts', 'AI Insights'].map((label, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                  <div className={`w-12 h-6 ${i % 2 === 0 ? 'bg-blue-600' : 'bg-slate-200'} rounded-full relative p-1 transition-colors cursor-pointer`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute ${i % 2 === 0 ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Language</label>
                <div className="relative">
                  <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none">
                    <option>English (US)</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Interface Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-slate-900 text-white p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                    <Palette className="w-4 h-4" />
                    Light Mode
                  </button>
                  <button className="bg-slate-50 border border-slate-200 text-slate-500 p-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                    Dark Space
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 ${isSaving ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white'} px-8 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95`}
          >
            {isSaving ? (
              <Globe className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
