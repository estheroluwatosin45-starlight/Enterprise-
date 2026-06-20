'use client';

import { useState, useEffect } from 'react';
import { Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminSettingsPage() {
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);
  const clearData = useAdminStore((state) => state.clearData);

  // Form states
  const [siteName, setSiteName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [ogGuidelines, setOgGuidelines] = useState('');
  
  const [showToast, setShowToast] = useState(false);

  // Sync settings when loaded/hydrated
  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || '');
      setSupportEmail(settings.supportEmail || '');
      setSiteDescription(settings.siteDescription || '');
      setMetaTitle(settings.metaTitle || '');
      setOgGuidelines(settings.ogGuidelines || '');
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      supportEmail,
      siteDescription,
      metaTitle,
      ogGuidelines,
    });
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete ALL posts and users? This cannot be undone.")) {
      clearData();
      alert("All data has been cleared.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400/35 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Settings saved successfully!</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure your CMS preferences and SEO defaults.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800">
          <div className="border-b border-white/40 dark:border-slate-850 px-6 py-4 bg-white/20 dark:bg-slate-900/20">
            <h2 className="font-bold text-slate-900 dark:text-white">General Identity</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Site Name</label>
                <input 
                  type="text" 
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Support Email</label>
                <input 
                  type="email" 
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium" 
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Site Description</label>
              <textarea 
                rows={3} 
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800">
          <div className="border-b border-white/40 dark:border-slate-850 px-6 py-4 bg-white/20 dark:bg-slate-900/20">
            <h2 className="font-bold text-slate-900 dark:text-white">SEO & Metadata</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Meta Title</label>
              <input 
                type="text" 
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Social Re-Share Guidelines / OpenGraph</label>
              <textarea 
                rows={3} 
                value={ogGuidelines}
                onChange={(e) => setOgGuidelines(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm hover:-translate-y-0.5 duration-300 cursor-pointer">
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </form>

      <div className="glass rounded-2xl overflow-hidden border border-red-500/20 dark:border-red-900/30 mt-8">
        <div className="border-b border-red-500/20 dark:border-red-950/20 px-6 py-4 bg-red-50/50 dark:bg-red-950/20">
          <h2 className="font-bold text-red-750 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            This will permanently delete all demo data, including articles, users, and categories. This action cannot be undone.
          </p>
          <button 
            onClick={handleClearData}
            className="bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors text-sm cursor-pointer"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
