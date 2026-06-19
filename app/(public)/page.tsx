'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Star } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function HomePage() {
  const posts = useAdminStore((state) => state.posts);
  const storeCategories = useAdminStore((state) => state.categories);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const featuredPosts = posts.filter(p => p.status === 'Published').slice(0, 3);

  if (!mounted) return null;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-sm font-medium mb-8 border border-blue-100">
          <Star className="w-4 h-4 fill-primary-600" />
          <span>Award-winning CMS Platform</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Crafting digital narratives with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-500">elegance and speed.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Enterprise CMS provides the ultimate publishing experience. Powered by Next.js and Supabase, designed for the modern web.
        </p>
        <div className="flex gap-4 items-center">
          <Link href="/blog" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2">
            Read Latest Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Featured Stories</h2>
            <p className="text-slate-500">Hand-picked insights from our top editors.</p>
          </div>
          <Link href="/blog" className="hidden sm:flex text-primary-600 hover:text-primary-700 font-medium items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-50 glass rounded-2xl">
              <p className="text-slate-500 font-medium text-lg">No articles have been published yet.</p>
            </div>
          ) : (
            featuredPosts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image 
                    src={post.image || `https://picsum.photos/seed/${post.id}/800/600`} 
                    alt={post.title} 
                    fill 
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <span className="font-medium text-slate-900">{post.author}</span>
                    <div className="flex items-center gap-2">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime || '5 min read'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-8 text-center">Explore by Category</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {storeCategories.map((cat, i) => (
            <Link href={`/blog?category=${cat.slug}`} key={i} className="glass-panel px-6 py-3 rounded-xl font-medium text-slate-700 hover:text-primary-600 hover:border-primary-300 transition-all shadow-sm">
               {cat.name}
            </Link>
          ))}
          {storeCategories.length === 0 && <span className="text-slate-500">No categories found.</span>}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass bg-gradient-to-br from-white/80 to-blue-50/80 rounded-3xl p-10 md:p-16 text-center border overflow-hidden relative">
          <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-primary-200/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -m-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Join 50,000+ Subscribers</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">Get the best stories, original insights, and expert viewpoints delivered to your inbox every week.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="flex-grow px-5 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
              <button type="submit" className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors sm:w-auto shadow-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
