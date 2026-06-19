'use client';

import Link from 'next/link';
import { Plus, Search, Filter, MoreVertical, Trash2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminPostsPage() {
  const posts = useAdminStore((state) => state.posts);
  const deletePost = useAdminStore((state) => state.deletePost);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Articles</h1>
          <p className="text-slate-500 text-sm mt-1">Manage, edit, and publish your blog content.</p>
        </div>
        <Link href="/admin/posts/new" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap self-start sm:self-auto hover:-translate-y-0.5 duration-300">
          <Plus className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/40 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/20">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 text-sm border-white/40 rounded-lg leading-5 bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow"
              placeholder="Search articles..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="block w-full pl-3 pr-8 py-2 text-sm border-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg bg-white/50 backdrop-blur-sm">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Pending</option>
            </select>
            <button className="flex items-center justify-center gap-2 px-3 py-2 border border-white/40 rounded-lg bg-white/50 hover:bg-white/70 backdrop-blur-sm text-slate-700 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white/30 text-slate-500 uppercase font-semibold text-xs border-b border-white/40">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Categories</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{post.title}</p>
                    <p className="text-xs text-slate-500 mt-1">/blog/{post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}</p>
                  </td>
                  <td className="px-6 py-4">{post.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      post.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                      post.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                      post.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white/60 text-slate-700 text-xs px-2.5 py-1 rounded-md">{post.category}</span>
                  </td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">{post.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No articles found. Create your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/40 flex justify-between items-center text-sm text-slate-500 bg-white/20">
          <span>Showing 1 to {posts.length} of {posts.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-white/40 rounded-md bg-white/50 hover:bg-white/70 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-white/40 rounded-md bg-white/50 hover:bg-white/70" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
