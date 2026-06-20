'use client';

import { useState } from 'react';
import { Upload, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useAdminStore } from '@/store/adminStore';

export default function AdminMediaPage() {
  const media = useAdminStore((state) => state.media);
  const addMedia = useAdminStore((state) => state.addMedia);
  const deleteMedia = useAdminStore((state) => state.deleteMedia);
  
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        addMedia({
          url: reader.result as string,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        });
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || 
      (filterType === 'Images' && item.type.startsWith('image/')) ||
      (filterType === 'Documents' && !item.type.startsWith('image/'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">Media Library</h1>
          <p className="text-slate-500 text-sm mt-1">Manage images and files used across your site.</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            id="media-upload" 
            className="hidden" 
            accept="image/*"
            onChange={handleUpload}
          />
          <label 
            htmlFor="media-upload"
            className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap hover:-translate-y-0.5 duration-300 animate-pulse-slow"
          >
            {isUploading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Upload className="w-5 h-5" />
            )}
            Upload Asset
          </label>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden p-6 space-y-6">
        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/20 p-4 rounded-xl border border-white/30">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm border border-slate-200/50 rounded-lg leading-5 bg-white/50 backdrop-blur-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow"
              placeholder="Search assets..."
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full md:w-auto px-3 py-2 text-sm border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg bg-white/50 backdrop-blur-sm"
            >
              <option value="All">All Types</option>
              <option value="Images">Images</option>
              <option value="Documents">Documents</option>
            </select>
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No media found</h3>
            <p className="text-sm max-w-sm text-center mb-6">Upload images or documents to use them in your content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id} className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-slate-100 overflow-hidden flex items-center justify-center">
                  {item.type.startsWith('image/') ? (
                    <Image 
                      src={item.url} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-slate-400" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => deleteMedia(item.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>{item.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.size} • {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

