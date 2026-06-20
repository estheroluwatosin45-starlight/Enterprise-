'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Users, Eye, TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const posts = useAdminStore((state) => state.posts);
  const users = useAdminStore((state) => state.users);
  const comments = useAdminStore((state) => state.comments);
  const updatePost = useAdminStore((state) => state.updatePost);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);

  useEffect(() => {
    if (currentUserRole === 'Super Admin') {
      router.replace('/admin/superadmin');
    }
  }, [currentUserRole, router]);

  if (currentUserRole === 'Super Admin') {
    return null;
  }

  const stats = [
    { label: 'Total Posts', value: posts.length.toString(), icon: <FileText className="w-6 h-6" />, change: posts.length ? '+12%' : '0%', trend: 'up' },
    { label: 'Total Users', value: users.length.toString(), icon: <Users className="w-6 h-6" />, change: users.length ? '+4%' : '0%', trend: 'up' },
    { label: 'Total Visitors', value: '1.2k', icon: <Eye className="w-6 h-6" />, change: '+25%', trend: 'up' },
    { label: 'Comments', value: comments.length.toString(), icon: <MessageSquare className="w-6 h-6" />, change: comments.length ? '+8%' : '0%', trend: 'up' },
  ];


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center border border-primary-200/50 dark:border-primary-900/30">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Recent Posts</h3>
            <Link href="/admin/posts" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-slate-200/50 dark:border-slate-800/40">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/5">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{post.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        post.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        post.status === 'Draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">{post.date}</td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      No recent posts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / pending */}
        <div className="glass rounded-2xl p-6 border border-white/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Pending Reviews</h3>
          <div className="space-y-4">
            {posts.filter(p => p.status === 'Pending Review').slice(0, 4).map((post, i) => (
              <div key={post.id} className="flex gap-4 p-4 rounded-xl border border-white/40 dark:border-slate-850 bg-white/40 dark:bg-slate-900/50 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-950/10 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0 border border-indigo-200 dark:border-indigo-900/30">
                  {post.author.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Submitted recently by {post.author}</p>
                  <div className="flex gap-2">
                    {currentUserRole === 'Super Admin' || currentUserRole === 'Chief Editor' ? (
                      <>
                        <button 
                          onClick={() => updatePost(post.id, { status: 'Published' })}
                          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updatePost(post.id, { status: 'Draft' })}
                          className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">Awaiting Admin approval</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {posts.filter(p => p.status === 'Pending Review').length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No reviews pending.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
