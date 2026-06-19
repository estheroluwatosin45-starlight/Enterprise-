'use client';

import { useState } from 'react';
import { Upload, Trash2, Search, Filter, FolderPlus, File as FileIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<{id: number, url: string, name: string, size: string, type: string, date: string}[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const deleteMedia = (id: number) => {
    setMedia(media.filter(item => item.id !== id));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        const newFile = {
          id: Math.random(),
          url: URL.createObjectURL(e.target.files![0]),
          name: e.target.files![0].name,
          size: (e.target.files![0].size / (1024 * 1024)).toFixed(2) + ' MB',
          type: e.target.files![0].type,
          date: 'Just now'
        };
        setMedia([newFile, ...media]);
        setIsUploading(false);
      }, 1000);
    }
  };

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
            className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap hover:-translate-y-0.5 duration-300"
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

      <div className="glass rounded-2xl overflow-hidden p-6">
        {media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">No media found</h3>
            <p className="text-sm max-w-sm text-center mb-6">Upload images or documents to use them in your content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-slate-100 overflow-hidden">
                  <Image 
                    src={item.url} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
