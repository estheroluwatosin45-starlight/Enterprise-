'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [role, setRole] = useState('Super Admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAdminStore((state) => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password, role)) {
      router.push('/admin');
    } else {
      setError('Invalid password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-sm">
            <Lock className="w-8 h-8 text-slate-800" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold font-display text-slate-900 text-center mb-2">Admin Access</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Select your role to access the CMS.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Select Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium bg-white"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Chief Editor">Chief Editor</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
            </select>
          </div>

          {role === 'Super Admin' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all font-medium"
                required
                autoFocus
              />
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-500 font-medium">
              You are logging in as <span className="font-semibold text-slate-800">{role}</span>. No password is required to access this simulation space.
            </div>
          )}
          
          {error && <p className="text-red-600 text-sm py-1 font-medium bg-red-50 px-3 rounded-md">{error}</p>}
          
          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition-all shadow-md text-lg block"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}

