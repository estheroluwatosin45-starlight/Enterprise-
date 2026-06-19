'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Eye, Clock, Users, ArrowUpRight, ArrowDownRight, MousePointerClick } from 'lucide-react';

const trafficData = [
  { name: 'Jan', views: 0 },
  { name: 'Feb', views: 0 },
  { name: 'Mar', views: 0 },
  { name: 'Apr', views: 0 },
  { name: 'May', views: 0 },
  { name: 'Jun', views: 0 },
];

const visitorData = [
  { name: 'Desktop', value: 0 },
  { name: 'Mobile', value: 0 },
  { name: 'Tablet', value: 0 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">Analytics Insights</h1>
        <p className="text-slate-500 text-sm mt-1">Detailed performance metrics for your publication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Page Views', value: '0', change: '0%', trend: 'up', icon: <Eye className="w-5 h-5" /> },
          { label: 'Unique Visitors', value: '0', change: '0%', trend: 'up', icon: <Users className="w-5 h-5" /> },
          { label: 'Avg. Session Duration', value: '0m 0s', change: '0%', trend: 'down', icon: <Clock className="w-5 h-5" /> },
          { label: 'Bounce Rate', value: '0%', change: '0%', trend: 'up', icon: <MousePointerClick className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-white/40">
            <div className="flex items-center gap-3 text-slate-500 mb-3">
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                {stat.icon}
              </div>
              <span className="font-semibold text-sm">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold font-display text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-white/40 lg:col-span-2">
          <h2 className="text-lg font-bold font-display text-slate-900 mb-6">Traffic Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/40">
          <h2 className="text-lg font-bold font-display text-slate-900 mb-6">Visitors by Device</h2>
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
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
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
