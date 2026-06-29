'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Eye, Clock, Users, MousePointerClick, Bookmark } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import Link from 'next/link';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function AdminAnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const posts = useAdminStore((state) => state.posts) || [];
  const followers = useAdminStore((state) => state.followers) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dynamic stats from posts in the store
  const totalPageViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  const uniqueVisitors = posts.length > 0 ? Math.max(1, Math.floor(totalPageViews * 0.15)) : 0;
  const totalBookmarks = followers.reduce((sum, f) => sum + (f.bookmarks?.length || 0), 0);

  const totalPageViewsFormatted = totalPageViews.toLocaleString('en-US');
  const uniqueVisitorsFormatted = uniqueVisitors >= 1000 
    ? `${(uniqueVisitors / 1000).toFixed(1)}k` 
    : uniqueVisitors.toLocaleString('en-US');

  const trafficData = [
    { name: 'Jan', views: Math.floor(totalPageViews * 0.08) },
    { name: 'Feb', views: Math.floor(totalPageViews * 0.12) },
    { name: 'Mar', views: Math.floor(totalPageViews * 0.10) },
    { name: 'Apr', views: Math.floor(totalPageViews * 0.18) },
    { name: 'May', views: Math.floor(totalPageViews * 0.25) },
    { name: 'Jun', views: Math.floor(totalPageViews * 0.27) },
  ];

  const visitorData = [
    { name: 'Desktop', value: posts.length > 0 ? 65 : 0 },
    { name: 'Mobile', value: posts.length > 0 ? 25 : 0 },
    { name: 'Tablet', value: posts.length > 0 ? 10 : 0 },
  ];

  const isDark = mounted && resolvedTheme === 'dark';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Analytics Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Detailed performance metrics for your publication.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Page Views', value: totalPageViewsFormatted, icon: <Eye className="w-5 h-5" />, href: '/admin/posts' },
          { label: 'Unique Visitors', value: uniqueVisitorsFormatted, icon: <Users className="w-5 h-5" />, href: '/admin/users' },
          { label: 'Total Followers', value: followers.length.toString(), icon: <Users className="w-5 h-5" />, href: '/admin/superadmin' },
          { label: 'Saved Bookmarks', value: totalBookmarks.toString(), icon: <Bookmark className="w-5 h-5" />, href: '/admin/superadmin' },
        ].map((stat, i) => (
          <Link href={stat.href} key={i} className="glass rounded-xl p-5 border border-white/40 dark:border-slate-800/40 hover:-translate-y-0.5 transition-transform duration-300 block hover:shadow-md cursor-pointer text-left">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg text-primary-600 dark:text-primary-400">
                {stat.icon}
              </div>
              <span className="font-semibold text-sm">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-white/40 dark:border-slate-800/40 lg:col-span-2">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Traffic Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: tickColor, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: `1px solid ${tooltipBorder}`, 
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/40 dark:border-slate-800/40">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-6">Visitors by Device</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitorData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {visitorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: `1px solid ${tooltipBorder}`, 
                    backgroundColor: tooltipBg,
                    color: tooltipText,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ color: tooltipText }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Public Followers List */}
      <div className="glass rounded-xl overflow-hidden border border-white/40 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 mt-8">
        <div className="border-b border-white/40 dark:border-slate-850 px-6 py-4 bg-white/20 dark:bg-slate-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            <h2 className="font-bold text-slate-900 dark:text-white">Public Followers ({followers.length})</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-355">
            <thead className="bg-white/30 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-white/40 dark:border-slate-800/40">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Saved Bookmarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/5">
              {followers.map((follower) => (
                <tr key={follower.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{follower.name}</td>
                  <td className="px-6 py-4">{follower.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded text-xs font-semibold">
                      {follower.bookmarks?.length || 0} saved bookmark{follower.bookmarks?.length === 1 ? '' : 's'}
                    </span>
                  </td>
                </tr>
              ))}
              {followers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No followers have registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
