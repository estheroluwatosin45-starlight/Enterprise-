'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, ImagePlus } from 'lucide-react';
import dynamic from 'next/dynamic';
const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false });
import { useAdminStore } from '@/store/adminStore';

export default function NewPostPage() {
  const router = useRouter();
  const addPost = useAdminStore((state) => state.addPost);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('<h2>Start writing your masterpiece...</h2>');
  const [status, setStatus] = useState('Draft');
  const categories = useAdminStore((state) => state.categories);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);
  const [category, setCategory] = useState(categories.length > 0 ? categories[0].name : '');
  const [author, setAuthor] = useState(currentUserRole);

  const [image, setImage] = useState('');
  const [readTime, setReadTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [publishDate, setPublishDate] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleSave = (publishStatus: string) => {
    if (!title) {
      alert('Title is required');
      return;
    }
    
    let formattedDate = undefined;
    if (publishDate) {
      formattedDate = new Date(publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    addPost({
      title,
      excerpt,
      content,
      status: publishStatus,
      category,
      author,
      image,
      readTime,
      ...(formattedDate ? { date: formattedDate } : {})
    });
    router.push('/admin/posts');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 text-slate-500 hover:text-slate-900 glass-button rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900">Create New Article</h1>
            <p className="text-slate-500 text-sm mt-1">Draft processing via Auto-Save.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button 
            onClick={() => handleSave('Draft')}
            className="glass-button text-slate-700 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('Published')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors inline-flex items-center gap-2 shadow-sm whitespace-nowrap border border-primary-500"
          >
            <Save className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl">
             <input 
               type="text" 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Article Title Here..." 
               className="w-full text-3xl font-bold font-display text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none mb-6"
             />
             
             <div className="mb-4">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Article Excerpt</label>
               <textarea 
                 rows={3} 
                 value={excerpt}
                 onChange={(e) => setExcerpt(e.target.value)}
                 placeholder="A brief summary of the article..."
                 className="w-full px-4 py-3 rounded-xl border-white/40 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-700 placeholder-slate-400 transition-shadow"
               ></textarea>
             </div>
             
             <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Content Editor</label>
               <div className="rounded-xl overflow-hidden border border-white/40 bg-white/50 backdrop-blur-sm">
                 <TipTapEditor value={content} onChange={setContent} />
               </div>
             </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-white/40 pb-3">Publishing Details</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-white/40 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              {status === 'Scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Publish Date & Time</label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-white/40 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-white/40 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <select 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-white/40 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                >
                  <option value={currentUserRole}>{currentUserRole} (Current)</option>
                  {useAdminStore(state => state.users).filter(u => u.status === 'Active' && u.name !== currentUserRole && u.role !== currentUserRole).map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Featured Image & Metadata */}
          <div className="glass p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-white/40 pb-3">Featured Image</h3>
              <div
                className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-white/50 flex flex-col items-center justify-center text-slate-500 hover:bg-white/80 hover:border-primary-400 transition-colors cursor-pointer relative overflow-hidden"
              >
                {image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Click to change</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 mb-2 text-slate-400" />
                    <span className="text-sm font-medium">Click or drag image to upload</span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImage(url);
                    }
                  }}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-white/40 pb-3">Read Time</h3>
              <input 
                type="text" 
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read" 
                className="w-full px-4 py-2 border border-white/40 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-white/40 pb-3">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
               {tags.map((tag) => (
                 <span key={tag} className="bg-primary-100/80 text-primary-700 border border-primary-200/50 text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                   {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))}><X className="w-3 h-3 hover:text-red-500" /></button>
                 </span>
               ))}
               {tags.length === 0 && <span className="text-xs text-slate-400">No tags added yet.</span>}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Add tag..." 
                className="flex-1 px-3 py-2 rounded-lg border border-white/40 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm placeholder-slate-400" 
              />
              <button type="button" onClick={handleAddTag} className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
