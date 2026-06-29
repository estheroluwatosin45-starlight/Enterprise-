'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Bookmark, User, Mail, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function FollowerProfilePage() {
  const router = useRouter();
  const currentFollower = useAdminStore((state) => state.currentFollower);
  const logoutFollower = useAdminStore((state) => state.logoutFollower);
  const posts = useAdminStore((state) => state.posts) || [];
  const toggleBookmark = useAdminStore((state) => state.toggleBookmark);
  const isInitialized = useAdminStore((state) => state.isInitialized);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized && !currentFollower) {
      router.replace('/login');
    }
  }, [mounted, isInitialized, currentFollower, router]);

  if (!mounted || !isInitialized || !currentFollower) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get bookmarked posts
  const bookmarkedPosts = posts.filter(p => currentFollower.bookmarks?.includes(p.id));

  const handleLogout = () => {
    logoutFollower();
    router.push('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Profile Overview Card */}
      <div className="glass p-8 rounded-3xl border border-white/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-200 dark:border-primary-900/30">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{currentFollower.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400 border border-primary-200/50 dark:border-primary-900/20">
                Follower
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 justify-center md:justify-start">
              <Mail className="w-4 h-4 text-slate-400" />
              {currentFollower.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border border-slate-200/50 dark:border-slate-800/50"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Bookmarked Stories Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Bookmark className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">Your Bookmarked Stories</h2>
        </div>

        {bookmarkedPosts.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-white/20 dark:border-slate-850 bg-white/20 dark:bg-slate-900/10 text-center space-y-4">
            <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No bookmarked articles yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Bookmark stories you love to save them in your profile and read them later.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline pt-2"
            >
              Browse Blog Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedPosts.map((post) => (
              <div
                key={post.id}
                className="glass rounded-3xl overflow-hidden border border-white/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Category & Action row */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/blog/${post.id}`} className="block group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer details */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-350">By {post.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
