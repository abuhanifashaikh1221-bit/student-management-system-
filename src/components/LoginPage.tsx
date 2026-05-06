/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await login(email, role);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden"
      >
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="relative z-10">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">EduStream Portal</h1>
            <p className="text-slate-400 font-medium">{isLogin ? 'Sign in to your account' : 'Create a institutional account'}</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Admin', 'Teacher', 'Student'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-2 ${
                    role === r 
                      ? 'bg-blue-50 border-blue-200 text-blue-600 ring-4 ring-blue-500/5' 
                      : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {r === 'Admin' && <ShieldCheck className="w-4 h-4" />}
                  {r === 'Teacher' && <Users className="w-4 h-4" />}
                  {r === 'Student' && <GraduationCap className="w-4 h-4" />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 pl-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 pl-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@edu.com"
                className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 pl-1">Password</label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                {isLogin ? 'Sign In to Dashboard' : 'Register Account'}
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 italic text-center">
            <p className="text-xs text-slate-400">
              Try <span className="text-slate-600 font-bold">admin@edu.com</span> for full access.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
