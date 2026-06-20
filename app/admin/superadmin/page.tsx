'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, Activity, HardDrive, Cpu, Terminal, 
  CheckCircle, RefreshCw, Layers, Database, Play
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface AuditLog {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'action';
  message: string;
}

export default function SuperAdminConsole() {
  const users = useAdminStore((state) => state.users);
  const posts = useAdminStore((state) => state.posts);
  const comments = useAdminStore((state) => state.comments);

  // Loading states for actions
  const [optimizing, setOptimizing] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Simulated Audit Logs State
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: '1', time: '10:24:02', type: 'success', message: 'Super Admin Babatunde unlocked Master Console' },
    { id: '2', time: '10:11:54', type: 'info', message: 'Zustand client store hydrated successfully: key enterprise-cms-storage-v3' },
    { id: '3', time: '09:42:15', type: 'action', message: 'Chief Editor Sarah Jenkins updated status of "Future of Next.js" to Published' },
    { id: '4', time: '08:55:30', type: 'action', message: 'Elena Rostova uploaded "modern-office.jpg" to Media Library (Base64 saved)' },
    { id: '5', time: '07:12:08', type: 'warning', message: 'Blocked Role Switch attempt bypassed: credentials required for Super Admin' },
    { id: '6', time: '06:00:00', type: 'success', message: 'Automated System: Daily incremental database backup completed (1.2MB)' },
  ]);

  // Handle actions
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleOptimizeDb = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      // Append a log
      const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [
        { id: Math.random().toString(), time: timeString, type: 'success', message: 'Database query indices optimized. Reclaimed 142KB.' },
        ...prev
      ]);
      triggerToast('Database optimized successfully!');
    }, 1500);
  };

  const handleClearCache = () => {
    setClearingCache(true);
    setTimeout(() => {
      setClearingCache(false);
      const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [
        { id: Math.random().toString(), time: timeString, type: 'info', message: 'System cache purged. Cleaned 82 static page routes.' },
        ...prev
      ]);
      triggerToast('System cache cleared!');
    }, 1200);
  };

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [
        { id: Math.random().toString(), time: timeString, type: 'success', message: `Manual database backup saved: backup_${Date.now()}.json` },
        ...prev
      ]);
      triggerToast('Backup generated and saved to storage!');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-xl shadow-lg border border-purple-500 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center border border-purple-200 dark:border-purple-900/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Console Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Welcome back, Babatunde. System is fully operational.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All Systems Nominal
        </div>
      </div>

      {/* Health Monitoring Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'CPU Utilization', value: '8.4%', sub: 'Optimized', icon: <Cpu className="w-5 h-5 text-purple-500" /> },
          { label: 'RAM Usage', value: '42.1%', sub: 'Normal', icon: <Layers className="w-5 h-5 text-blue-500" /> },
          { label: 'Database Size', value: '1.24 MB', sub: 'Healthy', icon: <Database className="w-5 h-5 text-indigo-500" /> },
          { label: 'API Latency', value: '24 ms', sub: 'Excellent', icon: <Activity className="w-5 h-5 text-emerald-500" /> },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audit Log Console */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col h-[400px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/10 dark:bg-slate-900/20 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-purple-500" />
              Live Audit Log Reader
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">Simulated Feed</span>
          </div>
          
          <div className="p-5 overflow-y-auto flex-1 font-mono text-xs space-y-3 bg-slate-950/20 dark:bg-slate-950/50">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-slate-600 dark:text-slate-350 hover:bg-white/5 dark:hover:bg-slate-800/10 p-1.5 rounded-lg transition-colors">
                <span className="text-purple-500 dark:text-purple-400 font-bold shrink-0">{log.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 ${
                  log.type === 'success' ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/40' :
                  log.type === 'warning' ? 'bg-amber-950/45 text-amber-400 border border-amber-900/40' :
                  log.type === 'action' ? 'bg-blue-950/45 text-blue-400 border border-blue-900/40' :
                  'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {log.type}
                </span>
                <p className="text-slate-800 dark:text-slate-300 leading-normal">{log.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Console Controls */}
        <div className="glass rounded-2xl p-6 border border-white/20 dark:border-slate-800 flex flex-col justify-between h-[400px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-500" />
              Operations Command
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Trigger immediate maintenance scripts directly on the CMS database.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleOptimizeDb}
              disabled={optimizing || clearingCache || backingUp}
              className="w-full bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-semibold py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm flex items-center justify-between text-sm cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                Optimize Database
              </span>
              {optimizing ? (
                <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
              ) : (
                <Play className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={handleClearCache}
              disabled={optimizing || clearingCache || backingUp}
              className="w-full bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-semibold py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm flex items-center justify-between text-sm cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                Clear System Cache
              </span>
              {clearingCache ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Play className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={handleBackup}
              disabled={optimizing || clearingCache || backingUp}
              className="w-full bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-semibold py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm flex items-center justify-between text-sm cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-500" />
                Create System Backup
              </span>
              {backingUp ? (
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
              ) : (
                <Play className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono">
            Secure connection via TLS 1.3
          </div>
        </div>
      </div>
    </div>
  );
}
