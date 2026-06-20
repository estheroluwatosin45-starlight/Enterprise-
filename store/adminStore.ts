'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  title: string;
  author: string;
  status: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  readTime?: string;
  tags?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  articles: number;
  status: string;
  initials: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  post: string;
  text: string;
  status: string;
  date: string;
}

interface AdminState {
  posts: Post[];
  users: User[];
  categories: Category[];
  media: MediaItem[];
  comments: Comment[];
  isAuthenticated: boolean;
  currentUserRole: string;

  addPost: (post: Omit<Post, 'id' | 'date'> & { date?: string }) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addMedia: (item: Omit<MediaItem, 'id' | 'date'>) => void;
  deleteMedia: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  updateCommentStatus: (id: string, status: string) => void;
  deleteComment: (id: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
  clearData: () => void;
  setCurrentUserRole: (role: string) => void;
}

// Initial seed data helper
const getInitialState = () => {
  const seedCategories: Category[] = [
    { id: 'cat-1', name: 'Technology', slug: 'technology', count: 1 },
    { id: 'cat-2', name: 'Design', slug: 'design', count: 1 },
    { id: 'cat-3', name: 'Business', slug: 'business', count: 0 },
    { id: 'cat-4', name: 'Lifestyle', slug: 'lifestyle', count: 0 },
  ];

  const seedUsers: User[] = [
    { id: 'u-1', name: 'PIPELOLUWA', email: 'PIPELOLUWA', role: 'Super Admin', articles: 2, status: 'Active', initials: 'PI' },
    { id: 'u-2', name: 'Jane Doe', email: 'jane@enterprise.com', role: 'Author', articles: 2, status: 'Active', initials: 'JD' },
  ];

  const seedPosts: Post[] = [
    {
      id: 'post-1',
      title: 'The Future of Web Development',
      author: 'PIPELOLUWA',
      status: 'Published',
      category: 'Technology',
      date: 'Jun 15, 2026',
      excerpt: 'Exploring the evolution of the web, Next.js 15, and state management trends.',
      content: '<h2>Introduction</h2><p>The web is changing faster than ever. Next.js 15 represents a massive leap forward in building server-side applications...</p>',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
      readTime: '5 min read',
      tags: ['Next.js', 'React', 'Zustand']
    },
    {
      id: 'post-2',
      title: 'Mastering UI Design Patterns',
      author: 'Jane Doe',
      status: 'Published',
      category: 'Design',
      date: 'Jun 18, 2026',
      excerpt: 'Deep dive into typography, spacing systems, and modern glassmorphism UI structures.',
      content: '<h2>Introduction</h2><p>Design is not just what it looks like and feels like. Design is how it works. In this guide, we deep dive into typography...</p>',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
      readTime: '7 min read',
      tags: ['Design', 'UX', 'Aesthetics']
    },
    {
      id: 'post-3',
      title: 'Startup Growth in 2026',
      author: 'Jane Doe',
      status: 'Pending Review',
      category: 'Business',
      date: 'Jun 19, 2026',
      excerpt: 'Key strategies for scaling SaaS businesses and leveraging agentic workflows.',
      content: '<h2>Introduction</h2><p>Scaling a business in 2026 requires understanding automated agent workflows and building a solid core product...</p>',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
      readTime: '4 min read',
      tags: ['SaaS', 'Business', 'Growth']
    },
    {
      id: 'post-4',
      title: 'Designing a Minimalist Workspace',
      author: 'PIPELOLUWA',
      status: 'Draft',
      category: 'Lifestyle',
      date: 'Jun 19, 2026',
      excerpt: 'How to build an inspiring desk setup that keeps you focused and productive.',
      content: '<h2>Introduction</h2><p>Your environment dictates your output. Let\'s look at how to optimize your physical workspace for high performance...</p>',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      readTime: '3 min read',
      tags: ['Workspace', 'Productivity', 'Lifestyle']
    }
  ];

  const seedMedia: MediaItem[] = [
    { id: 'm-1', name: 'tech_code.jpg', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60', size: '1.2 MB', type: 'image/jpeg', date: 'Jun 15, 2026' },
    { id: 'm-2', name: 'design_ui.jpg', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60', size: '0.8 MB', type: 'image/jpeg', date: 'Jun 18, 2026' },
    { id: 'm-3', name: 'business_chart.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60', size: '2.1 MB', type: 'image/jpeg', date: 'Jun 19, 2026' },
    { id: 'm-4', name: 'workspace_laptop.jpg', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60', size: '1.5 MB', type: 'image/jpeg', date: 'Jun 19, 2026' }
  ];

  const seedComments: Comment[] = [
    { id: 'c-1', author: 'Alex Smith', avatar: 'AS', post: 'The Future of Web Development', text: 'This is a fantastic overview of Next.js 15. The focus on React Server Components is game-changing!', status: 'Approved', date: 'Jun 16, 2026' },
    { id: 'c-2', author: 'Sarah Connor', avatar: 'SC', post: 'Mastering UI Design Patterns', text: 'Could you elaborate more on the fluid typography settings? The glassmorphism tips are excellent.', status: 'Approved', date: 'Jun 18, 2026' },
    { id: 'c-3', author: 'John Doe', avatar: 'JD', post: 'The Future of Web Development', text: 'Check out my spam website at http://spambot.com for cheap products!', status: 'Spam', date: 'Jun 17, 2026' },
    { id: 'c-4', author: 'Emily Watson', avatar: 'EW', post: 'The Future of Web Development', text: 'I have a question about Zustand middleware hydration. How do we prevent hydration errors?', status: 'Pending', date: 'Jun 19, 2026' }
  ];

  return {
    posts: seedPosts,
    users: seedUsers,
    categories: seedCategories,
    media: seedMedia,
    comments: seedComments,
  };
};

const initialData = getInitialState();

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      posts: initialData.posts,
      users: initialData.users,
      categories: initialData.categories,
      media: initialData.media,
      comments: initialData.comments,
      isAuthenticated: false,
      currentUserRole: 'Super Admin',

      addPost: (post) => set((state) => ({
        posts: [
          {
            ...post,
            id: Math.random().toString(36).substr(2, 9),
            date: post.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
          ...state.posts,
        ]
      })),
      updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map(post => post.id === id ? { ...post, ...updatedPost } : post)
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(post => post.id !== id)
      })),
      addUser: (user) => set((state) => ({
        users: [
          {
            ...user,
            id: Math.random().toString(36).substr(2, 9),
          },
          ...state.users,
        ]
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map(user => user.id === id ? { ...user, ...updatedUser } : user)
      })),
      addCategory: (category) => set((state) => ({
        categories: [
          ...state.categories,
          {
            ...category,
            id: Math.random().toString(36).substr(2, 9),
            count: 0
          }
        ]
      })),
      updateCategory: (id, updatedCategory) => set((state) => ({
        categories: state.categories.map(cat => cat.id === id ? { ...cat, ...updatedCategory } : cat)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(category => category.id !== id)
      })),
      addMedia: (item) => set((state) => ({
        media: [
          {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
          ...state.media
        ]
      })),
      deleteMedia: (id) => set((state) => ({
        media: state.media.filter(item => item.id !== id)
      })),
      addComment: (comment) => set((state) => ({
        comments: [
          {
            ...comment,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          },
          ...state.comments
        ]
      })),
      updateCommentStatus: (id, status) => set((state) => ({
        comments: state.comments.map(c => c.id === id ? { ...c, status } : c)
      })),
      deleteComment: (id) => set((state) => ({
        comments: state.comments.filter(c => c.id !== id)
      })),
      login: (password) => {
        if (password?.trim() === 'Babatunde07' || password?.trim() === 'PIPELOLUWA') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      clearData: () => set({ posts: [], users: [], categories: [], media: [], comments: [] }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => {
        const { isAuthenticated, ...rest } = state;
        return rest;
      },
    }
  )
);

