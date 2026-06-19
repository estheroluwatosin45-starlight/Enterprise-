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

interface AdminState {
  posts: Post[];
  users: User[];
  categories: Category[];
  isAuthenticated: boolean;
  currentUserRole: string;
  addPost: (post: Omit<Post, 'id' | 'date'> & { date?: string }) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  deleteCategory: (id: string) => void;
  login: (password: string) => boolean;
  logout: () => void;
  clearData: () => void;
  setCurrentUserRole: (role: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      posts: [],
      users: [],
      categories: [],
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
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(category => category.id !== id)
      })),
      login: (password) => {
        if (password === 'admin123') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      clearData: () => set({ posts: [], users: [] }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
