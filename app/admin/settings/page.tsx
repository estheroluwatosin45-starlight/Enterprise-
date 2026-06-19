'use client';

import { Save, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminSettingsPage() {
  const clearData = useAdminStore((state) => state.clearData);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete ALL posts and users? This cannot be undone.")) {
      clearData();
      alert("All data has been cleared.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Configure your CMS preferences and SEO defaults.</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="border-b border-white/40 px-6 py-4 bg-white/20">
          <h2 className="font-bold text-slate-900">General Identity</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
              <input type="text" defaultValue="Enterprise CMS" className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
              <input type="email" defaultValue="support@enterprisecms.com" className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
            <textarea rows={3} defaultValue="A premium, high-performance content management system." className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"></textarea>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="border-b border-white/40 px-6 py-4 bg-white/20">
          <h2 className="font-bold text-slate-900">SEO & Metadata</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Default Meta Title</label>
            <input type="text" defaultValue="Enterprise CMS | Premium Publishing Platform" className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Default Social Re-Share Guidelines / OpenGraph</label>
            <textarea rows={3} defaultValue="Read the latest articles from the industry's leading authors." className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"></textarea>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-red-500/20 mt-8">
        <div className="border-b border-red-500/20 px-6 py-4 bg-red-50/50">
          <h2 className="font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4 text-sm">
            This will permanently delete all demo data, including articles, users, and categories. This action cannot be undone.
          </p>
          <button 
            onClick={handleClearData}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Clear All Data
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm hover:-translate-y-0.5 duration-300">
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
