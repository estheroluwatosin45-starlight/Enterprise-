'use client';

import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { 
  Shield, Users, FileText, MessageSquare, Tag, 
  Trash2, Check, X, Plus 
} from 'lucide-react';

export default function SuperAdminConsole() {
  const users = useAdminStore((state) => state.users);
  const posts = useAdminStore((state) => state.posts);
  const comments = useAdminStore((state) => state.comments);
  const categories = useAdminStore((state) => state.categories);

  const updateUser = useAdminStore((state) => state.updateUser);
  const deleteUser = useAdminStore((state) => state.deleteUser);
  const updatePost = useAdminStore((state) => state.updatePost);
  const deletePost = useAdminStore((state) => state.deletePost);
  const updateCommentStatus = useAdminStore((state) => state.updateCommentStatus);
  const deleteComment = useAdminStore((state) => state.deleteComment);
  const addCategory = useAdminStore((state) => state.addCategory);
  const deleteCategory = useAdminStore((state) => state.deleteCategory);

  // States
  const [newCatName, setNewCatName] = useState('');

  // Helper colors
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Super Admin': return 'bg-purple-100/80 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40';
      case 'Chief Editor': return 'bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40';
      case 'Editor': return 'bg-blue-100/80 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40';
      case 'Author': return 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    setNewCatName('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center border border-red-200 dark:border-red-900/30">
          <Shield className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Super Admin Command Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Master control panel with immediate CRUD authority over all CMS operations.</p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 text-purple-600 dark:text-purple-400">
            <Users className="w-5 h-5" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30">Users</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Registered</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{users.length}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">Articles</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Posts</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{posts.length}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 text-emerald-600 dark:text-emerald-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">Comments</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total User Discussions</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{comments.length}</p>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2 text-indigo-600 dark:text-indigo-400">
            <Tag className="w-5 h-5" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30">Categories</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-medium">Active Sections</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{categories.length}</p>
        </div>
      </div>

      {/* Grid of Control Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Panel 1: Team Control */}
        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col min-h-[400px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Team Members & Status Command
            </h2>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Instant Authority Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getRoleColor(user.role)}`}>
                          {user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white text-xs">{user.role}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        user.status === 'Blocked' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5 items-center">
                        {user.role !== 'Super Admin' && (
                          <>
                            {user.status === 'Active' ? (
                              <button 
                                onClick={() => updateUser(user.id, { status: 'Blocked' })}
                                className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 rounded-lg transition-colors border border-red-200/50 dark:border-red-900/35"
                              >
                                Block
                              </button>
                            ) : (
                              <button 
                                onClick={() => updateUser(user.id, { status: 'Active' })}
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-lg transition-colors border border-emerald-200/50 dark:border-emerald-900/35"
                              >
                                Activate
                              </button>
                            )}
                            <select 
                              value={user.role}
                              onChange={(e) => updateUser(user.id, { role: e.target.value })}
                              className="text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 outline-none text-slate-800 dark:text-white"
                            >
                              <option value="Chief Editor" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Chief Editor</option>
                              <option value="Editor" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Editor</option>
                              <option value="Author" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Author</option>
                              <option value="Super Admin" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Super Admin</option>
                            </select>
                          </>
                        )}
                        {user.id !== 'u-1' && (
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 2: Content Command Center */}
        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col min-h-[400px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Content & Publishing Moderation
            </h2>
          </div>
          <div className="p-0 overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Title</th>
                  <th className="px-5 py-3.5">Author</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">{post.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">/blog/{post.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 dark:text-slate-300">{post.author}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        post.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                        post.status === 'Draft' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5 items-center">
                        <select 
                          value={post.status}
                          onChange={(e) => updatePost(post.id, { status: e.target.value })}
                          className="text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-2 py-1 outline-none text-slate-800 dark:text-white"
                        >
                          <option value="Published" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Published</option>
                          <option value="Draft" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Draft</option>
                          <option value="Pending Review" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Pending Review</option>
                        </select>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                      No articles in store.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 3: Discussion Moderation */}
        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col min-h-[350px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Discussions & Feedback Command
            </h2>
          </div>
          <div className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[400px]">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/30 space-y-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{comment.author}</span>
                    <span className="text-[10px] text-slate-400">{comment.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      comment.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                      comment.status === 'Spam' ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs italic">On: {comment.post}</p>
                  <p className="text-slate-700 dark:text-slate-200 text-sm bg-white/40 p-2 rounded-lg border border-white/50">{comment.text}</p>
                </div>
                <div className="flex sm:flex-col gap-1 items-end justify-end shrink-0">
                  {comment.status !== 'Approved' && (
                    <button 
                      onClick={() => updateCommentStatus(comment.id, 'Approved')}
                      className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-lg flex items-center gap-1 w-full justify-center transition-colors"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {comment.status !== 'Spam' && (
                    <button 
                      onClick={() => updateCommentStatus(comment.id, 'Spam')}
                      className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 rounded-lg flex items-center gap-1 w-full justify-center transition-colors"
                    >
                      <X className="w-3 h-3" /> Spam
                    </button>
                  )}
                  <button 
                    onClick={() => deleteComment(comment.id)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 rounded-lg flex items-center gap-1 w-full justify-center transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-8">No comments available.</p>
            )}
          </div>
        </div>

        {/* Panel 4: Categories & Quick Workspace */}
        <div className="glass rounded-2xl overflow-hidden border border-white/20 dark:border-slate-800 flex flex-col min-h-[350px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-500" />
              Category Workspace
            </h2>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input 
                type="text" 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Quick add category..."
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-sm text-slate-800 dark:text-white"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold rounded-xl text-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[220px] pt-2">
              {categories.map((cat) => {
                const count = posts.filter(p => p.category === cat.name).length;
                return (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/20 hover:bg-white/40 dark:hover:bg-slate-850/50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-950 dark:text-white truncate">{cat.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{count} Articles</p>
                    </div>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-slate-400 text-xs col-span-2 text-center py-6">No categories configured.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
