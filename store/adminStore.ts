'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// Supabase database integration helpers
const loadFromSupabase = async (key: string, defaultValue: any) => {
  if (!supabase) return defaultValue;
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record doesn't exist yet, insert the default seed value
        await supabase.from('settings').insert({ key, value: defaultValue });
        return defaultValue;
      }
      console.warn(`Supabase load error for ${key}:`, error.message);
      return defaultValue;
    }
    return data?.value ?? defaultValue;
  } catch (err) {
    console.warn(`Supabase fetch failed for ${key}:`, err);
    return defaultValue;
  }
};

const saveToSupabase = async (key: string, value: any) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) {
      console.warn(`Supabase save error for ${key}:`, error.message);
    }
  } catch (err) {
    console.warn(`Supabase save failed for ${key}:`, err);
  }
};

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
  views?: number;
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

export interface SiteSettings {
  siteName: string;
  supportEmail: string;
  siteDescription: string;
  metaTitle: string;
  ogGuidelines: string;
  ceoName?: string;
  chiefEditorName?: string;
  leadArchitectName?: string;
  headOfDesignName?: string;
  ceoSeed?: string;
  chiefEditorSeed?: string;
  leadArchitectSeed?: string;
  headOfDesignSeed?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  postId?: string;
}

interface AdminState {
  posts: Post[];
  users: User[];
  categories: Category[];
  media: MediaItem[];
  comments: Comment[];
  isAuthenticated: boolean;
  currentUserRole: string;
  settings: SiteSettings;
  notifications: Notification[];

  addPost: (post: Omit<Post, 'id' | 'date'> & { id?: string, date?: string }) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  approvePost: (postId: string) => void;
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
  updateSettings: (settings: Partial<SiteSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isInitialized: boolean;
  initializeStore: () => Promise<void>;
}

// Initial seed data helper
const getInitialState = () => {
  const seedCategories: Category[] = [];

  const seedUsers: User[] = [
    { id: 'u-1', name: 'Babatunde', email: 'babatunde@enterprise.com', role: 'Super Admin', articles: 0, status: 'Active', initials: 'BA' },
  ];

  const seedPosts: Post[] = [];
  const seedMedia: MediaItem[] = [];
  const seedComments: Comment[] = [];
  const seedNotifications: Notification[] = [];
  const seedSettings: SiteSettings = {
    siteName: 'Enterprise CMS',
    supportEmail: 'support@enterprisecms.com',
    siteDescription: 'A premium, high-performance content management system.',
    metaTitle: 'Enterprise CMS | Premium Publishing Platform',
    ogGuidelines: "Read the latest articles from the industry's leading authors.",
    ceoName: 'Babatunde Funmilayo',
    chiefEditorName: '',
    leadArchitectName: '',
    headOfDesignName: '',
    ceoSeed: 'babatunde',
    chiefEditorSeed: 'sarah',
    leadArchitectSeed: 'david',
    headOfDesignSeed: 'elena',
  };

  return {
    posts: seedPosts,
    users: seedUsers,
    categories: seedCategories,
    media: seedMedia,
    comments: seedComments,
    settings: seedSettings,
    notifications: seedNotifications,
  };
};

const initialData = getInitialState();

export const useAdminStore = create<AdminState>()((set) => ({
  posts: initialData.posts,
  users: initialData.users,
  categories: initialData.categories,
  media: initialData.media,
  comments: initialData.comments,
  isAuthenticated: false,
  currentUserRole: 'Super Admin',
  settings: initialData.settings,
  notifications: initialData.notifications,
  isInitialized: false,

      addPost: (post) => set((state) => ({
        posts: [
          {
            ...post,
            id: post.id || Math.random().toString(36).substr(2, 9),
            date: post.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: post.views !== undefined ? post.views : 0,
          },
          ...state.posts,
        ]
      })),
      updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map(post => post.id === id ? { ...post, ...updatedPost } : post)
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(post => post.id !== id),
        notifications: (state.notifications || []).map(n => n.postId === id ? { ...n, read: true } : n)
      })),
      approvePost: (postId) => set((state) => ({
        posts: state.posts.map(post => post.id === postId ? { ...post, status: 'Published' } : post),
        notifications: (state.notifications || []).map(n => n.postId === postId ? { ...n, read: true } : n)
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
      login: (password, role = 'Editor') => {
        if (password?.trim() === 'Babatunde07' || password?.trim() === 'PIPELOLUWA07') {
          set({ isAuthenticated: true, currentUserRole: role });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      clearData: () => set({ posts: [], users: [], categories: [], media: [], comments: [] }),
      setCurrentUserRole: (role) => set({ currentUserRole: role }),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            read: false,
          },
          ...(state.notifications || []),
        ]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: (state.notifications || []).map(n => n.id === id ? { ...n, read: true } : n)
      })),
      clearAllNotifications: () => set({ notifications: [] }),
      initializeStore: async () => {
        if (!supabase) {
          set({ isInitialized: true });
          return;
        }
        try {
          const posts = await loadFromSupabase('cms_posts', initialData.posts);
          const categories = await loadFromSupabase('cms_categories', initialData.categories);
          const comments = await loadFromSupabase('cms_comments', initialData.comments);
          const users = await loadFromSupabase('cms_users', initialData.users);
          const settings = await loadFromSupabase('cms_settings', initialData.settings);
          const notifications = await loadFromSupabase('cms_notifications', initialData.notifications);
          const media = await loadFromSupabase('cms_media', initialData.media);

          set({
            posts,
            categories,
            comments,
            users,
            settings,
            notifications,
            media,
            isInitialized: true,
          });
        } catch (err) {
          console.error('Failed to initialize Supabase store:', err);
          set({ isInitialized: true });
        }
      },
    }));

if (typeof window !== 'undefined') {
  let prevPosts = useAdminStore.getState().posts;
  let prevCategories = useAdminStore.getState().categories;
  let prevComments = useAdminStore.getState().comments;
  let prevUsers = useAdminStore.getState().users;
  let prevSettings = useAdminStore.getState().settings;
  let prevNotifications = useAdminStore.getState().notifications;
  let prevMedia = useAdminStore.getState().media;

  useAdminStore.subscribe((state) => {
    if (!state.isInitialized) {
      // Keep previous references synchronized during the loading phase
      prevPosts = state.posts;
      prevCategories = state.categories;
      prevComments = state.comments;
      prevUsers = state.users;
      prevSettings = state.settings;
      prevNotifications = state.notifications;
      prevMedia = state.media;
      return;
    }

    if (state.posts !== prevPosts) {
      prevPosts = state.posts;
      saveToSupabase('cms_posts', state.posts);
    }
    if (state.categories !== prevCategories) {
      prevCategories = state.categories;
      saveToSupabase('cms_categories', state.categories);
    }
    if (state.comments !== prevComments) {
      prevComments = state.comments;
      saveToSupabase('cms_comments', state.comments);
    }
    if (state.users !== prevUsers) {
      prevUsers = state.users;
      saveToSupabase('cms_users', state.users);
    }
    if (state.settings !== prevSettings) {
      prevSettings = state.settings;
      saveToSupabase('cms_settings', state.settings);
    }
    if (state.notifications !== prevNotifications) {
      prevNotifications = state.notifications;
      saveToSupabase('cms_notifications', state.notifications);
    }
    if (state.media !== prevMedia) {
      prevMedia = state.media;
      saveToSupabase('cms_media', state.media);
    }
  });
}

