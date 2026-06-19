'use client';

import { useState } from 'react';
import { MessageSquare, Check, X, Search, Filter, Trash2 } from 'lucide-react';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<{ id: number, author: string, avatar: string, post: string, text: string, status: string, date: string }[]>([]);

  const updateStatus = (id: number, status: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status } : c));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Spam': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Comments</h1>
          <p className="text-slate-500 text-sm mt-1">Moderate user discussions and feedback.</p>
        </div>
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
              placeholder="Search comments..."
            />
          </div>
          <select className="block w-full md:w-auto px-3 py-2 text-sm border-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg bg-white/50 backdrop-blur-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Spam</option>
          </select>
        </div>
        
        <div className="divide-y divide-white/40">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-white/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{comment.author}</span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-500 text-xs">{comment.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(comment.status)}`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    On: <span className="font-medium text-slate-600 hover:text-primary-600 cursor-pointer">{comment.post}</span>
                  </p>
                  <p className="text-slate-700 text-sm bg-white/50 p-3 rounded-lg border border-white/40 mb-3">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-2">
                    {comment.status !== 'Approved' && (
                      <button onClick={() => updateStatus(comment.id, 'Approved')} className="text-xs flex items-center gap-1 font-medium text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {comment.status !== 'Spam' && (
                      <button onClick={() => updateStatus(comment.id, 'Spam')} className="text-xs flex items-center gap-1 font-medium text-amber-600 hover:bg-amber-50 px-2 py-1 rounded transition-colors">
                        <X className="w-3 h-3" /> Mark Spam
                      </button>
                    )}
                    <button className="text-xs flex items-center gap-1 font-medium text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors ml-auto">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
             <div className="p-8 text-center text-slate-500">
               No comments available.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
