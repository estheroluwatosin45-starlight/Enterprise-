'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Image as ImageIcon, Users, Settings, Tag, MessageSquare, LogOut, Edit3, BarChart } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Logo } from '@/components/ui/Logo';

import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const logout = useAdminStore((state) => state.logout);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);
  const setCurrentUserRole = useAdminStore((state) => state.setCurrentUserRole);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [mounted, isAuthenticated, pathname, router]);

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
    isActive(path) 
      ? 'bg-primary-500/10 text-primary-700' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

  if (!mounted) return null;

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/40 dark:border-slate-800 flex flex-col hidden md:flex z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/50 bg-white/40">
           <Link href="/">
             <Logo />
           </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-4">
            <Link href="/admin" className={navLinkClass('/admin')}>
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="/admin/posts" className={navLinkClass('/admin/posts')}>
              <FileText className="w-5 h-5" />
              Articles
            </Link>
            <Link href="/admin/categories" className={navLinkClass('/admin/categories')}>
              <Tag className="w-5 h-5" />
              Categories
            </Link>
            <Link href="/admin/media" className={navLinkClass('/admin/media')}>
              <ImageIcon className="w-5 h-5" />
              Media Library
            </Link>
            <Link href="/admin/comments" className={navLinkClass('/admin/comments')}>
              <MessageSquare className="w-5 h-5" />
              Comments
            </Link>
            
            <div className="pt-6 mt-6 border-t border-slate-200/50">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Management</p>
              
              {currentUserRole === 'Super Admin' && (
                <>
                  <Link href="/admin/users" className={navLinkClass('/admin/users')}>
                    <Users className="w-5 h-5" />
                    Team & Roles
                  </Link>
                  <Link href="/admin/analytics" className={navLinkClass('/admin/analytics')}>
                    <BarChart className="w-5 h-5" />
                    Analytics
                  </Link>
                  <Link href="/admin/settings" className={navLinkClass('/admin/settings')}>
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                </>
              )}
              {currentUserRole !== 'Super Admin' && (
                <div className="px-3 py-2 text-xs text-slate-400 bg-slate-100 rounded-lg mx-3">
                  Only Super Admins can access management features.
                </div>
              )}
            </div>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200/50 bg-white/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${currentUserRole === 'Super Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
              {currentUserRole === 'Super Admin' ? 'SA' : 'AU'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{currentUserRole}</p>
              <select 
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="text-xs text-slate-500 bg-transparent outline-none w-full cursor-pointer hover:text-slate-800"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Author">Author</option>
              </select>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-0">
        {/* Admin Header */}
        <header className="h-16 glass-panel border-b border-white/40 dark:border-slate-800 flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
          <h1 className="text-xl font-bold font-display text-slate-800 dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 glass-button px-4 py-1.5 rounded-full">View Public Site</Link>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentUserRole !== 'Super Admin' && pathname && (pathname.startsWith('/admin/users') || pathname.startsWith('/admin/analytics') || pathname.startsWith('/admin/settings')) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-display text-slate-800 mb-2">Access Restricted</h2>
              <p className="text-slate-500 mb-6">You need Super Admin privileges to view this area.</p>
              <Link href="/admin" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">Return to Dashboard</Link>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
