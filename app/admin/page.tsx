'use client';

import { FileText, Users, Eye, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const posts = useAdminStore((state) => state.posts);
  const users = useAdminStore((state) => state.users);
  const updatePost = useAdminStore((state) => state.updatePost);

  const stats = [
    { label: 'Total Posts', value: posts.length.toString(), icon: <FileText className="w-6 h-6" />, change: posts.length ? '+12%' : '0%', trend: 'up' },
    { label: 'Total Users', value: users.length.toString(), icon: <Users className="w-6 h-6" />, change: users.length ? '+4%' : '0%', trend: 'up' },
    { label: 'Total Visitors', value: '0', icon: <Eye className="w-6 h-6" />, change: '0%', trend: 'up' },
    { label: 'Comments', value: '0', icon: <MessageSquare className="w-6 h-6" />, change: '0%', trend: 'down' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold font-display text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/40 flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-slate-900">Recent Posts</h3>
            <Link href="/admin/posts" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-white/40 text-slate-500 uppercase font-semibold text-xs border-b border-white/40">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-white/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{post.title}</td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                        post.status === 'Draft' ? 'bg-slate-100 text-slate-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{post.date}</td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No recent posts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / pending */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-bold font-display text-slate-900 mb-6">Pending Reviews</h3>
          <div className="space-y-4">
            {posts.filter(p => p.status === 'Pending Review').slice(0, 4).map((post, i) => (
              <div key={post.id} className="flex gap-4 p-4 rounded-xl border border-white/40 bg-white/40 hover:border-primary-200 hover:bg-primary-50/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0 border border-indigo-200">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">Submitted recently by {post.author}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updatePost(post.id, { status: 'Published' })}
                      className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updatePost(post.id, { status: 'Draft' })}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {posts.filter(p => p.status === 'Pending Review').length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No reviews pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
