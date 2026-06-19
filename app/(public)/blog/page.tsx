'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Clock } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function BlogPage() {
  const posts = useAdminStore((state) => state.posts);
  const storeCategories = useAdminStore((state) => state.categories);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const allPosts = posts.filter(p => p.status === 'Published');

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Latest Articles</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Discover insights on technology, design, and building the future from our team of experts.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 p-4 glass rounded-2xl border dark:border-slate-800">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 sm:text-sm transition-shadow dark:text-slate-100"
            placeholder="Search articles..."
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 sm:text-sm rounded-xl border bg-white dark:bg-slate-900 dark:text-slate-100">
            <option>All Categories</option>
            {storeCategories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Sort</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPosts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-900/50 glass rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No articles found.</p>
          </div>
        ) : (
          allPosts.map((post) => (
            <div key={post.id} className="h-full">
              <Link href={`/blog/${post.id}`} className="group flex flex-col glass dark:bg-slate-900/50 border dark:border-slate-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary-900/10 transition-all duration-300 h-full">
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image 
                    src={post.image || `https://picsum.photos/seed/${post.id}/800/600`} 
                    alt={post.title} 
                    fill 
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 w-full flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <span className="font-medium text-slate-900 dark:text-slate-200">{post.author}</span>
                    <div className="flex items-center gap-2">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime || '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
