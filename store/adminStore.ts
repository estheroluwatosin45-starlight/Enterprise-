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
  login: (password: string, role?: string) => boolean;
  logout: () => void;
  clearData: () => void;
  setCurrentUserRole: (role: string) => void;
}

// Initial seed data helper
const getInitialState = () => {
  const seedCategories: Category[] = [];

  const seedUsers: User[] = [
    { id: 'u-1', name: 'Babatunde', email: 'babatunde@enterprise.com', role: 'Super Admin', articles: 0, status: 'Active', initials: 'BA' },
    { id: 'u-2', name: 'Sarah Jenkins', email: 'sarah@enterprise.com', role: 'Chief Editor', articles: 0, status: 'Active', initials: 'SJ' },
    { id: 'u-3', name: 'Marcus Vance', email: 'marcus@enterprise.com', role: 'Editor', articles: 0, status: 'Active', initials: 'MV' },
    { id: 'u-4', name: 'Elena Rostova', email: 'elena@enterprise.com', role: 'Author', articles: 0, status: 'Active', initials: 'ER' },
  ];

  const seedPosts: Post[] = [];
  const seedMedia: MediaItem[] = [];
  const seedComments: Comment[] = [];

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
      login: (password, role = 'Super Admin') => {
        if (role !== 'Super Admin') {
          set({ isAuthenticated: true, currentUserRole: role });
          return true;
        }
        if (password?.trim() === 'Babatunde07' || password?.trim() === 'PIPELOLUWA07') {
          set({ isAuthenticated: true, currentUserRole: 'Super Admin' });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      clearData: () => set({ posts: [], users: [], categories: [], media: [], comments: [] }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
    }),
    {
      name: 'enterprise-cms-storage-v3',
      partialize: (state) => {
        const { isAuthenticated, ...rest } = state;
        return rest;
      },
    }
  )
);

