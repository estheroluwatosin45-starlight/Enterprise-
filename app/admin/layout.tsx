'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Image as ImageIcon, Users, Settings, Tag, MessageSquare, LogOut, Edit3, BarChart, ShieldAlert, Shield } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);
  const logout = useAdminStore((state) => state.logout);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);
  const setCurrentUserRole = useAdminStore((state) => state.setCurrentUserRole);
  const users = useAdminStore((state) => state.users);

  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [superAdminPassword, setSuperAdminPassword] = useState('');
  const [superAdminError, setSuperAdminError] = useState('');
  const [onSuccessAction, setOnSuccessAction] = useState<(() => void) | null>(null);

  const roleInitials: Record<string, string> = {
    'Super Admin': 'SA',
    'Chief Editor': 'CE',
    'Editor': 'ED',
    'Author': 'AU',
  };

  const roleBadgeStyles: Record<string, string> = {
    'Super Admin': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/35 dark:text-purple-300 dark:border-purple-800/40',
    'Chief Editor': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-300 dark:border-indigo-800/40',
    'Editor': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/35 dark:text-blue-300 dark:border-blue-800/40',
    'Author': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/35 dark:text-emerald-300 dark:border-emerald-800/40',
  };

  const getInitials = (role: string) => roleInitials[role] || 'U';
  const getBadgeStyle = (role: string) => roleBadgeStyles[role] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-750';
  
  useEffect(() => {
    setMounted(true);
    let unsub: (() => void) | undefined;
    if (useAdminStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      unsub = useAdminStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    if (mounted && hydrated) {
      if (!isAuthenticated && pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else if (isAuthenticated && pathname === '/admin/login') {
        router.replace('/admin');
      }
    }
  }, [mounted, hydrated, isAuthenticated, pathname, router]);

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

  if (!mounted || !hydrated) return null;

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isRoleBlocked = users.some(u => u.role === currentUserRole && u.status === 'Blocked');

  const renderSuperAdminModal = () => {
    if (!isSuperAdminModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center border border-red-200/50 dark:border-red-900/30">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Super Admin Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unlock Master Control Console</p>
            </div>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (superAdminPassword === 'Babatunde07' || superAdminPassword === 'PIPELOLUWA07') {
                setIsSuperAdminModalOpen(false);
                setSuperAdminPassword('');
                setSuperAdminError('');
                if (onSuccessAction) onSuccessAction();
              } else {
                setSuperAdminError('Incorrect password.');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-350 mb-1.5">Master Password</label>
              <input 
                type="password"
                value={superAdminPassword}
                onChange={(e) => {
                  setSuperAdminPassword(e.target.value);
                  setSuperAdminError('');
                }}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-sm font-medium"
                required
                autoFocus
              />
            </div>
            
            {superAdminError && <p className="text-red-600 text-xs font-medium bg-red-50 dark:bg-red-950/30 dark:text-red-400 px-3 py-1.5 rounded-lg">{superAdminError}</p>}
            
            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button"
                onClick={() => {
                  setIsSuperAdminModalOpen(false);
                  setSuperAdminPassword('');
                  setSuperAdminError('');
                }}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Unlock Mode
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isRoleBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="glass p-8 rounded-2xl max-w-md w-full border border-red-200 dark:border-red-900/50 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/30 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Account Suspended</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Your simulated role <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUserRole}</span> has been blocked by the Super Admin.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setOnSuccessAction(() => () => {
                  setCurrentUserRole('Super Admin');
                });
                setIsSuperAdminModalOpen(true);
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] duration-200 shadow-sm"
            >
              Switch to Super Admin
            </button>
            <button
              onClick={() => {
                router.push('/');
                setTimeout(() => {
                  logout();
                }, 100);
              }}
              className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 py-2.5 rounded-xl font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
          {renderSuperAdminModal()}
        </div>
      </div>
    );
  }

  if (currentUserRole === 'Super Admin') {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-white font-sans">
        {/* Sidebar */}
        <aside className="w-64 glass border-r border-white/40 dark:border-slate-800 flex flex-col hidden md:flex z-20 shrink-0">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 bg-white/40 dark:bg-slate-900/20">
            <Link href="/">
              <Logo />
            </Link>
            <span className="text-[10px] font-bold bg-purple-100 text-purple-750 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/30 px-2.5 py-0.5 rounded-full animate-pulse">Master Mode</span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-1.5 px-4">
              <Link href="/admin/superadmin" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/admin/superadmin') ? 'bg-purple-500/10 text-purple-750 dark:text-purple-300 border border-purple-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                <Shield className="w-5 h-5 text-purple-500" />
                Console Home
              </Link>
              <Link href="/admin/users" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/admin/users') ? 'bg-purple-500/10 text-purple-750 dark:text-purple-300 border border-purple-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                <Users className="w-5 h-5" />
                Team & Roles
              </Link>
              <Link href="/admin/analytics" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/admin/analytics') ? 'bg-purple-500/10 text-purple-750 dark:text-purple-300 border border-purple-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                <BarChart className="w-5 h-5" />
                Analytics
              </Link>
              <Link href="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/admin/settings') ? 'bg-purple-500/10 text-purple-750 dark:text-purple-300 border border-purple-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                <Settings className="w-5 h-5" />
                System Settings
              </Link>
            </nav>
          </div>
          
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-850 bg-white/40 dark:bg-slate-900/20">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold border bg-purple-100 text-purple-750 dark:bg-purple-950/35 dark:text-purple-300 dark:border-purple-800/40 shrink-0">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">Babatunde</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Super Admin Mode</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (confirm('Exit Super Admin Mode? You will return to standard editor dashboard.')) {
                  setCurrentUserRole('Editor');
                  router.push('/admin');
                }
              }}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30 rounded-xl transition-all mb-2"
            >
              Exit Super Admin Mode
            </button>
            <button 
              onClick={() => {
                router.push('/');
                setTimeout(() => {
                  logout();
                }, 100);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-0">
          <header className="h-16 glass-panel border-b border-white/40 dark:border-slate-800 flex items-center justify-between px-8 z-10 shrink-0 shadow-sm">
            <h1 className="text-xl font-bold font-display text-slate-800 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Master Command Console
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" className="text-sm font-medium text-purple-650 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 glass-button px-4 py-1.5 rounded-full">View Public Site</Link>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Render Standard CMS Layout (Author, Editor, Chief Editor)
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
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200/50 bg-white/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors shrink-0 ${getBadgeStyle(currentUserRole)}`}>
              {getInitials(currentUserRole)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{currentUserRole}</p>
              <select 
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="text-xs text-slate-500 bg-transparent outline-none w-full cursor-pointer hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <option value="Chief Editor" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Chief Editor</option>
                <option value="Editor" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Editor</option>
                <option value="Author" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Author</option>
              </select>
            </div>
          </div>

          <button 
            onClick={() => {
              setOnSuccessAction(() => () => {
                setCurrentUserRole('Super Admin');
                router.push('/admin/superadmin');
              });
              setIsSuperAdminModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 rounded-xl transition-all mb-3 shadow-sm hover:scale-[1.02] duration-200"
          >
            <Shield className="w-4 h-4" />
            Enter Super Admin Mode
          </button>
          
          <button 
            onClick={() => {
              router.push('/');
              setTimeout(() => {
                logout();
              }, 100);
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
          {currentUserRole !== 'Super Admin' && pathname && (pathname.startsWith('/admin/superadmin') || pathname.startsWith('/admin/users') || pathname.startsWith('/admin/analytics') || pathname.startsWith('/admin/settings')) ? (
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
      {renderSuperAdminModal()}
    </div>
  );
}
