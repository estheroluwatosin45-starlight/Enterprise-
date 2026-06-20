'use client';

import { useState } from 'react';
import { UserPlus, Shield, MoreVertical, Search, Filter, Trash2, X } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export default function AdminUsersPage() {
  const users = useAdminStore((state) => state.users);
  const deleteUser = useAdminStore((state) => state.deleteUser);
  const addUser = useAdminStore((state) => state.addUser);
  const updateUser = useAdminStore((state) => state.updateUser);

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Author');

  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  // Derive counts
  const superAdmins = users.filter((u) => u.role === 'Super Admin').length;
  const chiefEditors = users.filter((u) => u.role === 'Chief Editor').length;
  const authorsAndEditors = users.filter((u) => u.role === 'Author' || u.role === 'Editor').length;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      articles: 0,
      status: 'Pending',
      initials,
    });
    
    setNewName('');
    setNewEmail('');
    setNewRole('Author');
    setShowModal(false);
  };

  const getColorClass = (role: string) => {
    switch(role) {
      case 'Super Admin': return 'bg-purple-100/80 text-purple-700 border border-purple-200';
      case 'Chief Editor': return 'bg-indigo-100/80 text-indigo-700 border border-indigo-200';
      case 'Editor': return 'bg-blue-100/80 text-blue-700 border border-blue-200';
      case 'Author': return 'bg-emerald-100/80 text-emerald-700 border border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Team & Roles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage users, authors, and permission levels.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap self-start sm:self-auto hover:-translate-y-0.5 duration-300"
        >
          <UserPlus className="w-5 h-5" />
          Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100/80 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 rounded-xl flex items-center justify-center border border-purple-200 dark:border-purple-900/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Super Admins</h3>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">{superAdmins}</p>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100/80 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-900/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Chief Editors</h3>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">{chiefEditors}</p>
            </div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100/80 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-900/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Authors & Editors</h3>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">{authorsAndEditors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/40 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/20 dark:bg-slate-900/20">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow text-slate-900 dark:text-white"
              placeholder="Search users..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full pl-3 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white"
            >
              <option value="All Roles">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Chief Editor">Chief Editor</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[350px] pb-12">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-350">
            <thead className="bg-white/30 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 uppercase font-semibold text-xs border-b border-white/40 dark:border-slate-800/40">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Articles</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40 dark:divide-slate-800/40">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/40 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${getColorClass(user.role)}`}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.role}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.articles}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 
                      user.status === 'Blocked' ? 'bg-red-100/80 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                      'bg-amber-100/80 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.status === 'Pending' && (
                      <button 
                      onClick={() => useAdminStore.getState().updateUser(user.id, { status: 'Active' })}
                        className="px-3 py-1 mr-2 text-xs font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuUserId(activeMenuUserId === user.id ? null : user.id)}
                        className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-white/50 dark:hover:bg-slate-850/50 transition-colors"
                        title="Change Role"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeMenuUserId === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuUserId(null)}></div>
                          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-20 py-1 text-left">
                            <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">Change Role</div>
                            {['Super Admin', 'Chief Editor', 'Editor', 'Author'].map((role) => (
                              <button
                                key={role}
                                onClick={() => {
                                  updateUser(user.id, { role });
                                  setActiveMenuUserId(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${user.role === role ? 'text-primary-600 font-semibold bg-primary-50/50 dark:bg-primary-950/20' : 'text-slate-700 dark:text-slate-300'}`}
                              >
                                {role}
                              </button>
                            ))}
                            {user.role !== 'Super Admin' && (
                              <>
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">Account Status</div>
                                {user.status !== 'Active' && (
                                  <button
                                    onClick={() => {
                                      updateUser(user.id, { status: 'Active' });
                                      setActiveMenuUserId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors font-medium"
                                  >
                                    Activate Account
                                  </button>
                                )}
                                {user.status !== 'Blocked' && (
                                  <button
                                    onClick={() => {
                                      updateUser(user.id, { status: 'Blocked' });
                                      setActiveMenuUserId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium"
                                  >
                                    Block Account
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Invite Team Member
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium placeholder-slate-400 transition-shadow"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium placeholder-slate-400 transition-shadow"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Assign Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white font-medium transition-shadow"
                >
                  <option value="Super Admin" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Super Admin</option>
                  <option value="Chief Editor" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Chief Editor</option>
                  <option value="Editor" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Editor</option>
                  <option value="Author" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Author</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm cursor-pointer"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
