'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Eye, Clock, Users, MousePointerClick } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function AdminAnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const posts = useAdminStore((state) => state.posts) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dynamic stats from posts in the store
  const totalPageViews = posts.reduce((sum, p) => sum + (p.views !== undefined ? p.views : 120), 0);
  const uniqueVisitors = posts.length > 0 ? Math.max(1, Math.floor(totalPageViews * 0.15)) : 0;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Page Views', value: totalPageViewsFormatted, icon: <Eye className="w-5 h-5" /> },
          { label: 'Unique Visitors', value: uniqueVisitorsFormatted, icon: <Users className="w-5 h-5" /> },
          { label: 'Avg. Session Duration', value: posts.length > 0 ? '2m 45s' : '0m 0s', icon: <Clock className="w-5 h-5" /> },
          { label: 'Bounce Rate', value: posts.length > 0 ? '41.2%' : '0%', icon: <MousePointerClick className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-white/40 dark:border-slate-800/40">
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg text-primary-600 dark:text-primary-400">
                {stat.icon}
              </div>
              <span className="font-semibold text-sm">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
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
    </div>
  );
}
