'use client';

import Link from 'next/link';
import { Search, Menu, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAdminStore } from '@/store/adminStore';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>
          <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
            <Link href="/" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
            <Link href="/blog" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Articles</Link>
            <Link href="/about" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">Contact</Link>
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
              <button className="text-slate-400 hover:text-slate-500">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
