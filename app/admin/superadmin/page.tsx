'use client';

import { 
  Shield, Activity, Layers, Database, Bell, CheckCircle, Clock, Trash2, XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';

export default function SuperAdminConsole() {
  const users = useAdminStore((state) => state.users);
  const posts = useAdminStore((state) => state.posts);
  const comments = useAdminStore((state) => state.comments);
  const categories = useAdminStore((state) => state.categories);
  const notifications = useAdminStore((state) => state.notifications) || [];
  const updatePost = useAdminStore((state) => state.updatePost);
  const approvePost = useAdminStore((state) => state.approvePost);
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center border border-primary-200 dark:border-primary-900/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Console Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Welcome back, Babatunde. System is fully operational.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All Systems Nominal
        </div>
      </div>

      {/* High-Visibility Alert Banner */}
      {unreadPostNotifications.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-100 text-sm">Action Required: New Articles</h3>
              <p className="text-red-700 dark:text-red-300 text-xs mt-0.5">
                You have {unreadPostNotifications.length} newly published article{unreadPostNotifications.length > 1 ? 's' : ''} waiting for your review. Please scroll down to the Notification Center.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/superadmin/notifications"
            className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm text-center"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Health Monitoring Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Articles', value: posts.length.toString(), sub: 'Active Posts', icon: <Layers className="w-5 h-5 text-primary-500" />, href: '/admin/posts' },
          { label: 'Team Members', value: users.length.toString(), sub: 'Registered Users', icon: <Shield className="w-5 h-5 text-blue-500" />, href: '/admin/users' },
          { label: 'User Comments', value: comments.length.toString(), sub: 'Discussions Feed', icon: <Activity className="w-5 h-5 text-indigo-500" />, href: '/admin/comments' },
          { label: 'Active Categories', value: categories.length.toString(), sub: 'Configured Sections', icon: <Database className="w-5 h-5 text-emerald-500" />, href: '/admin/categories' },
        ].map((stat, i) => (
          <Link 
            href={stat.href} 
            key={i} 
            className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800 hover:-translate-y-0.5 transition-transform duration-300 block hover:shadow-md hover:bg-white/40 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {stat.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Notification Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
        
        {/* Approvals Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-500" />
                Published Articles for Review ({pendingPosts.length})
              </h2>
              <button
                onClick={() => {
                  const testPost = posts.length > 0 ? posts[0] : null;
                  if (testPost) {
                    useAdminStore.getState().addNotification({
                      type: 'review_post',
                      title: 'Test Article Published',
                      message: `System Tester published an article: "${testPost.title}". Please review it.`,
                      postId: testPost.id
                    });
                  } else {
                    alert("Create at least one article first to test notifications!");
                  }
                }}
                className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-md hover:bg-primary-200 transition-colors border border-primary-200"
              >
                + Generate Test Notification
              </button>
            </div>
          </div>
          
          {pendingPosts.length === 0 ? (
            <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white font-medium">All caught up!</p>
              <p className="text-slate-500 text-sm">There are no new articles waiting for your review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingPosts.map(post => (
                <div key={post.id} className="glass p-5 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Notifications Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              System Alerts
            </h2>
          </div>
          
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
