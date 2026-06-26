'use client';

import { useAdminStore } from '@/store/adminStore';
import { Bell, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const notifications = useAdminStore((state) => state.notifications) || [];
  const posts = useAdminStore((state) => state.posts) || [];
  const approvePost = useAdminStore((state) => state.approvePost);
  const clearAllNotifications = useAdminStore((state) => state.clearAllNotifications);
  const deletePost = useAdminStore((state) => state.deletePost);
  const markNotificationRead = useAdminStore((state) => state.markNotificationRead);

  const unreadPostNotifications = notifications.filter(n => !n.read && n.type === 'review_post' && n.postId);
  const pendingPosts = posts.filter(p => unreadPostNotifications.some(n => n.postId === p.id));

  const handleApprove = (postId: string) => {
    approvePost(postId);
  };

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to completely delete this article from the website?")) {
      deletePost(postId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" />
            Notifications & Approvals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review pending articles and system alerts.</p>
        </div>
        <button 
          onClick={() => clearAllNotifications()}
          className="text-sm font-medium text-slate-600 hover:text-red-600 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-800/50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Approvals Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Published Articles for Review ({pendingPosts.length})</h2>
          
          {pendingPosts.length === 0 ? (
            <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white font-medium">All caught up!</p>
              <p className="text-slate-500 text-sm">There are no new articles waiting for your review.</p>
            </div>
          ) : (
            pendingPosts.map(post => (
              <div key={post.id} className="glass p-5 rounded-2xl border border-amber-200/50 dark:border-amber-900/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                      post.status === 'Published'
                        ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                        : 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40'
                    }`}>
                      {post.status === 'Published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {post.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">By <span className="font-medium text-slate-700 dark:text-slate-300">{post.author}</span> in {post.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {post.excerpt || 'No excerpt provided for this article. Please review the full content.'}
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button 
                    onClick={() => handleApprove(post.id)}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800/50"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Publish
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800/50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Article
                  </button>
                  <Link href={`/admin/posts/${post.id}`} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl transition-colors">
                    Edit / View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* System Notifications Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">System Alerts</h2>
          
          <div className="glass p-1 rounded-2xl">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No new notifications.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-4 transition-colors ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {notif.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {!notif.read && (
                        <button 
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[10px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
