'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect } from 'react';
import { Clock, ArrowLeft, Bookmark } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { notFound, useRouter } from 'next/navigation';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const posts = useAdminStore((state) => state.posts);
  const post = posts.find((p) => p.id === slug);
  const updatePost = useAdminStore((state) => state.updatePost);
  const currentFollower = useAdminStore((state) => state.currentFollower);
  const toggleBookmark = useAdminStore((state) => state.toggleBookmark);

  useEffect(() => {
    if (post) {
      updatePost(post.id, { views: (post.views || 0) + 1 });
    }
  }, [post?.id, updatePost]);

  if (!post) {
    return notFound();
  }
  
  const readTime = post.readTime || '5 min read';
  const isBookmarked = currentFollower?.bookmarks?.includes(post.id) || false;

  return (
    <article className="w-full min-h-screen">
      {/* Hero */}
      <div className="w-full relative overflow-hidden bg-slate-950 dark:bg-black text-white pt-32 pb-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </Link>
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full border border-primary-500/30">{post.category}</span>
            <span className="flex items-center gap-1 text-slate-300"><Clock className="w-4 h-4" /> {readTime}</span>
            
            <button
              onClick={() => {
                if (currentFollower) {
                  toggleBookmark(post.id);
                } else {
                  router.push('/login');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all cursor-pointer backdrop-blur-sm"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-primary-400 fill-primary-400' : 'text-slate-350'}`} />
              <span className="text-xs font-semibold">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-8">
            {post.title}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-lg font-bold">
              {post.author.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-medium text-white">{post.author}</p>
              <p className="text-sm text-slate-400">{post.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 mb-16">
        <div className="w-full h-[400px] md:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl glass-panel border dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
          <Image 
            src={post.image || `https://picsum.photos/seed/${post.id}/1920/1080`}
            alt={post.title}
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="prose prose-lg dark:prose-invert prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 max-w-none mb-16">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
}
