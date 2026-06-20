'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
const TipTapEditor = dynamic(() => import('@/components/editor/TipTapEditor'), { ssr: false });
import { useAdminStore } from '@/store/adminStore';

export default function NewPostPage() {
  const router = useRouter();
  const addPost = useAdminStore((state) => state.addPost);
  const categories = useAdminStore((state) => state.categories);
  const currentUserRole = useAdminStore((state) => state.currentUserRole);
  const media = useAdminStore((state) => state.media);
  const addMedia = useAdminStore((state) => state.addMedia);
  const addNotification = useAdminStore((state) => state.addNotification);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('<h2>Start writing your masterpiece...</h2>');
  const [status, setStatus] = useState('Draft');
  
  // Set default category if categories exist
  const [category, setCategory] = useState('');
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const [author, setAuthor] = useState(currentUserRole);
  const [image, setImage] = useState('');
  const [readTime, setReadTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [publishDate, setPublishDate] = useState('');

  // Media selection modal state
  const [showMediaModal, setShowMediaModal] = useState(false);

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
    if (!category) {
      alert('Please select a category or create one first');
      return;
    }
    
    let formattedDate = undefined;
    if (publishDate) {
      formattedDate = new Date(publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    const newPostId = Math.random().toString(36).substr(2, 9);
    
    if (publishStatus === 'Published' && currentUserRole !== 'Super Admin') {
      addNotification({
        type: 'review_post',
        title: 'New Article Published',
        message: `${author} has published a new article: "${title}". Please review it.`,
        postId: newPostId
      });
    }

    addPost({
      id: newPostId,
      title,
      excerpt,
      content,
      status: publishStatus,
      category,
      author,
      image,
      readTime: readTime || '5 min read',
      tags,
      ...(formattedDate ? { date: formattedDate } : {})
    });
    router.push('/admin/posts');
  };

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        // 1. Add to media library so it is saved
        addMedia({
          url: base64Url,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        });
        // 2. Set as post featured image
        setImage(base64Url);
      };
      reader.readAsDataURL(file);
    }
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-700 placeholder-slate-400 transition-shadow"
                ></textarea>
             </div>
             
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content Editor</label>
                <div className="rounded-xl overflow-hidden border border-slate-200/60 bg-white/50 backdrop-blur-sm">
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
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
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {categories.length === 0 && (
                    <option value="" disabled>No categories available. Please create one first.</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <select 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm text-slate-700"
                >
                  <option value={currentUserRole}>{currentUserRole} (Current)</option>
                  {useAdminStore.getState().users.filter(u => u.status === 'Active' && u.name !== currentUserRole && u.role !== currentUserRole).map(u => (
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
              
              {image ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-inner group mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => setImage('')} 
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Remove Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-white/50 flex flex-col items-center justify-center text-slate-500 hover:bg-white/80 hover:border-primary-400 transition-colors relative mb-3">
                  <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                  <span className="text-xs font-semibold">No image selected</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaModal(true)}
                  className="flex-1 text-center py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold bg-white/50 hover:bg-white text-slate-700 transition-colors"
                >
                  Choose From Library
                </button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFeaturedImageUpload}
                  />
                  <button
                    type="button"
                    className="w-full text-center py-2 px-3 border border-primary-200 rounded-lg text-xs font-semibold bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Upload New
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-white/40 pb-3">Read Time</h3>
              <input 
                type="text" 
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read" 
                className="w-full px-4 py-2 border border-slate-200 bg-white/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-700 placeholder-slate-400"
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
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm placeholder-slate-400" 
              />
              <button type="button" onClick={handleAddTag} className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMediaModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-xl overflow-hidden border border-slate-200 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Select Media</h2>
              <button onClick={() => setShowMediaModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {media.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-sm">No media in your library yet. Upload one from the main Media Library page!</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {media.filter(m => m.type.startsWith('image/')).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setImage(item.url);
                        setShowMediaModal(false);
                      }}
                      className="group aspect-square relative rounded-xl border border-slate-200 overflow-hidden hover:border-primary-500 cursor-pointer hover:shadow-md transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-semibold bg-black/60 px-2 py-1 rounded">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowMediaModal(false)} 
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition-colors text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

