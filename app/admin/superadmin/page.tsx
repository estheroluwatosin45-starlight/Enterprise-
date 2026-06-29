'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, Activity, Layers, Database, Bell, CheckCircle, Clock, Trash2, XCircle, Save, Users, Eye, FileText, MessageSquare, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';

export default function SuperAdminConsole() {
  const router = useRouter();
  const users = useAdminStore((state) => state.users);
  const posts = useAdminStore((state) => state.posts);
  const comments = useAdminStore((state) => state.comments);
  const categories = useAdminStore((state) => state.categories);
  const notifications = useAdminStore((state) => state.notifications) || [];
  const updatePost = useAdminStore((state) => state.updatePost);
  const approvePost = useAdminStore((state) => state.approvePost);
  const deletePost = useAdminStore((state) => state.deletePost);
  const markNotificationRead = useAdminStore((state) => state.markNotificationRead);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);
  
  const settings = useAdminStore((state) => state.settings);
  const updateSettings = useAdminStore((state) => state.updateSettings);

  const totalPageViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const uniqueVisitors = posts.length > 0 ? Math.max(1, Math.floor(totalPageViews * 0.15)) : 0;
  const uniqueVisitorsFormatted = uniqueVisitors >= 1000 
    ? `${(uniqueVisitors / 1000).toFixed(1)}k` 
    : uniqueVisitors.toLocaleString('en-US');

  const [ceoName, setCeoName] = useState('');
  const [ceoSeed, setCeoSeed] = useState('');
  const [chiefEditorName, setChiefEditorName] = useState('');
  const [chiefEditorSeed, setChiefEditorSeed] = useState('');
  const [leadArchitectName, setLeadArchitectName] = useState('');
  const [leadArchitectSeed, setLeadArchitectSeed] = useState('');
  const [headOfDesignName, setHeadOfDesignName] = useState('');
  const [headOfDesignSeed, setHeadOfDesignSeed] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (settings) {
      setCeoName(settings.ceoName || '');
      setCeoSeed(settings.ceoSeed || 'babatunde');
      setChiefEditorName(settings.chiefEditorName || '');
      setChiefEditorSeed(settings.chiefEditorSeed || 'sarah');
      setLeadArchitectName(settings.leadArchitectName || '');
      setLeadArchitectSeed(settings.leadArchitectSeed || 'david');
      setHeadOfDesignName(settings.headOfDesignName || '');
      setHeadOfDesignSeed(settings.headOfDesignSeed || 'elena');
    }
  }, [settings]);

  const handleUpdateLeadership = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ceoName,
      ceoSeed,
      chiefEditorName,
      chiefEditorSeed,
      leadArchitectName,
      leadArchitectSeed,
      headOfDesignName,
      headOfDesignSeed,
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

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
        <div 
          onClick={() => {
            const element = document.getElementById('notification-center');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-100 text-sm">Action Required: New Articles</h3>
              <p className="text-red-700 dark:text-red-300 text-xs mt-0.5">
                You have {unreadPostNotifications.length} newly published article{unreadPostNotifications.length > 1 ? 's' : ''} waiting for your review. Click here to go to the Notification Center.
              </p>
            </div>
          </div>
          <button 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm text-center"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Articles', value: posts.length.toString(), icon: <Layers className="w-6 h-6" />, change: posts.length ? '+12%' : '0%', trend: 'up', href: '/admin/posts' },
          { label: 'Team Members', value: users.length.toString(), icon: <Users className="w-6 h-6" />, change: users.length ? '+4%' : '0%', trend: 'up', href: '/admin/users' },
          { label: 'User Comments', value: comments.length.toString(), icon: <MessageSquare className="w-6 h-6" />, change: comments.length ? '+8%' : '0%', trend: 'up', href: '/admin/comments' },
          { label: 'Active Categories', value: categories.length.toString(), icon: <Database className="w-6 h-6" />, change: categories.length ? '+3%' : '0%', trend: 'up', href: '/admin/categories' },
          { label: 'Total Visitors', value: uniqueVisitorsFormatted, icon: <Eye className="w-6 h-6" />, change: uniqueVisitors > 0 ? '+25%' : '0%', trend: 'up', href: '/admin/analytics' },
        ].map((stat, i) => (
          <Link 
            href={stat.href} 
            key={i} 
            className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 hover:-translate-y-0.5 transition-transform duration-300 block hover:shadow-md cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center border border-primary-200/50 dark:border-primary-900/30">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Admin Dashboard Page Contents (Recent Activity & Pending Reviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
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
            {posts.filter(p => p.status === 'Pending Review').slice(0, 4).map((post) => (
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

      {/* Notification Center */}
      <div id="notification-center" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
        
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

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-400/35 transition-all animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">Leadership updated successfully!</span>
        </div>
      )}

      {/* Leadership Team Management */}
      <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800/40 mt-12 bg-white/40 dark:bg-slate-900/40">
        <div className="border-b border-white/40 dark:border-slate-850 px-6 py-4 bg-white/20 dark:bg-slate-900/20 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">Leadership Team Management</h2>
        </div>
        <form onSubmit={handleUpdateLeadership} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CEO & Founder */}
            <div className="space-y-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400">CEO / Founder</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
                  <input 
                    type="text" 
                    value={ceoName}
                    onChange={(e) => setCeoName(e.target.value)}
                    placeholder="E.g. Babatunde Funmilayo"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avatar Image Keyword</label>
                  <input 
                    type="text" 
                    value={ceoSeed}
                    onChange={(e) => setCeoSeed(e.target.value)}
                    placeholder="E.g. babatunde"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Chief Editor */}
            <div className="space-y-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400">Chief Editor</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
                  <input 
                    type="text" 
                    value={chiefEditorName}
                    onChange={(e) => setChiefEditorName(e.target.value)}
                    placeholder="E.g. Sarah Chen"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avatar Image Keyword</label>
                  <input 
                    type="text" 
                    value={chiefEditorSeed}
                    onChange={(e) => setChiefEditorSeed(e.target.value)}
                    placeholder="E.g. sarah"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Lead Architect */}
            <div className="space-y-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400">Lead Architect</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
                  <input 
                    type="text" 
                    value={leadArchitectName}
                    onChange={(e) => setLeadArchitectName(e.target.value)}
                    placeholder="E.g. David Kim"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avatar Image Keyword</label>
                  <input 
                    type="text" 
                    value={leadArchitectSeed}
                    onChange={(e) => setLeadArchitectSeed(e.target.value)}
                    placeholder="E.g. david"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Head of Design */}
            <div className="space-y-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <h3 className="font-semibold text-sm text-primary-600 dark:text-primary-400">Head of Design</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
                  <input 
                    type="text" 
                    value={headOfDesignName}
                    onChange={(e) => setHeadOfDesignName(e.target.value)}
                    placeholder="E.g. Elena Rivers"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Avatar Image Keyword</label>
                  <input 
                    type="text" 
                    value={headOfDesignSeed}
                    onChange={(e) => setHeadOfDesignSeed(e.target.value)}
                    placeholder="E.g. elena"
                    className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer hover:-translate-y-0.5 duration-300">
              <Save className="w-4 h-4" />
              Save Leadership Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
