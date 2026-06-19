'use client';

import { useState } from 'react';
import { Tag, Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';

export default function AdminCategoriesPage() {
  const categories = useAdminStore((state) => state.categories);
  const addCategory = useAdminStore((state) => state.addCategory);
  const deleteCat = useAdminStore((state) => state.deleteCategory);

  const [showModal, setShowModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    
    addCategory({
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    
    setNewCatName('');
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Organize your content into sections.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap self-start sm:self-auto hover:-translate-y-0.5 duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
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
              placeholder="Search categories..."
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white/30 text-slate-500 uppercase font-semibold text-xs border-b border-white/40">
              <tr>
                <th className="px-6 py-4 w-1/2">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-center">Articles</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-4 text-center font-medium bg-slate-50/50">
                    <span className="bg-white px-2 py-1 rounded-md text-primary-700 shadow-sm border border-slate-200/50">{cat.count}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteCat(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-white/50 transition-colors ml-1">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                 <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                     No categories available.
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
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 shadow-xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add Category</h2>
            </div>
            <form onSubmit={handleCreateCat} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Finance"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
