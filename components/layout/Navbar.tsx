'use client';

import Link from 'next/link';
import { Search, Menu, User, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAdminStore } from '@/store/adminStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const logout = useAdminStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      logout();
    }
  }, [mounted, isAuthenticated, logout]);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg rounded-full">
        <div className="px-6 sm:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
              <Link href="/" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
              <Link href="/blog" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Articles</Link>
              <Link href="/about" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Contact</Link>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-250 relative">
                {isSearchVisible ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (navbarSearchQuery.trim()) {
                        router.push(`/blog?search=${encodeURIComponent(navbarSearchQuery.trim())}`);
                        setNavbarSearchQuery('');
                        setIsSearchVisible(false);
                      }
                    }}
                    className="flex items-center animate-in slide-in-from-right-3 duration-300"
                  >
                    <input 
                      type="text"
                      value={navbarSearchQuery}
                      onChange={(e) => setNavbarSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="px-3 py-1 border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 w-32 transition-all dark:text-white"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsSearchVisible(false)}
                      className="ml-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchVisible(true)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-355 transition-colors cursor-pointer"
                    title="Search Articles"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 shadow-xl animate-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col space-y-2 px-2">
              {/* Mobile Search input */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (navbarSearchQuery.trim()) {
                    router.push(`/blog?search=${encodeURIComponent(navbarSearchQuery.trim())}`);
                    setNavbarSearchQuery('');
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="relative mb-3 w-full"
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 dark:text-slate-550" />
                </div>
                <input 
                  type="text"
                  value={navbarSearchQuery}
                  onChange={(e) => setNavbarSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-white"
                />
              </form>
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 px-3 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Home
              </Link>
              <Link 
                href="/blog" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 px-3 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Articles
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 px-3 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 px-3 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
