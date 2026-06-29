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

// LocalStorage fallback helpers
const loadFromLocalStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Local storage load error for ${key}:`, err);
    return defaultValue;
  }
};

const saveToLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Local storage save error for ${key}:`, err);
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
  ceoImage?: string;
  chiefEditorImage?: string;
  leadArchitectImage?: string;
  headOfDesignImage?: string;
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

export interface Follower {
  id: string;
  name: string;
  email: string;
  password?: string;
  bookmarks: string[];
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
  followers: Follower[];
  currentFollower: Follower | null;
  signupFollower: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  loginFollower: (email: string, password?: string) => boolean;
  logoutFollower: () => void;
  toggleBookmark: (postId: string) => void;
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
    ceoImage: '',
    chiefEditorImage: '',
    leadArchitectImage: '',
    headOfDesignImage: '',
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
  followers: [],
  currentFollower: null,
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
      signupFollower: (name, email, password) => {
        const state = useAdminStore.getState();
        const exists = state.followers.some(f => f.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { success: false, error: 'Email already registered.' };
        }
        const newFollower = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          password,
          bookmarks: []
        };

        const newNotification = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'new_follower',
          title: 'New Follower Joined',
          message: `${name} (${email}) has joined your website as a follower!`,
          date: new Date().toISOString(),
          read: false
        };

        set((state) => ({
          followers: [...state.followers, newFollower],
          currentFollower: newFollower,
          notifications: [newNotification, ...(state.notifications || [])]
        }));
        return { success: true };
      },
      loginFollower: (email, password) => {
        const state = useAdminStore.getState();
        const follower = state.followers.find(
          f => f.email.toLowerCase() === email.toLowerCase() && f.password === password
        );
        if (follower) {
          set({ currentFollower: follower });
          return true;
        }
        return false;
      },
      logoutFollower: () => set({ currentFollower: null }),
      toggleBookmark: (postId) => set((state) => {
        if (!state.currentFollower) return {};
        const bookmarks = state.currentFollower.bookmarks.includes(postId)
          ? state.currentFollower.bookmarks.filter(id => id !== postId)
          : [...state.currentFollower.bookmarks, postId];
        const updatedFollower = { ...state.currentFollower, bookmarks };
        const followers = state.followers.map(f => f.id === state.currentFollower?.id ? updatedFollower : f);
        return {
          currentFollower: updatedFollower,
          followers
        };
      }),
      initializeStore: async () => {
        try {
          let posts, categories, comments, users, settings, notifications, media;

          let followers = [];
          let currentFollower = null;

          if (supabase) {
            posts = await loadFromSupabase('cms_posts', initialData.posts);
            categories = await loadFromSupabase('cms_categories', initialData.categories);
            comments = await loadFromSupabase('cms_comments', initialData.comments);
            users = await loadFromSupabase('cms_users', initialData.users);
            settings = await loadFromSupabase('cms_settings', initialData.settings);
            notifications = await loadFromSupabase('cms_notifications', initialData.notifications);
            media = await loadFromSupabase('cms_media', initialData.media);
            followers = await loadFromSupabase('cms_followers', []);

            // Subscribe to real-time changes on the settings table
            supabase
              .channel('settings-realtime')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'settings',
                },
                (payload) => {
                  const updatedRow = payload.new as { key: string; value: any };
                  if (updatedRow && updatedRow.key) {
                    const currentState = useAdminStore.getState();
                    
                    if (updatedRow.key === 'cms_posts') {
                      if (JSON.stringify(currentState.posts) !== JSON.stringify(updatedRow.value)) {
                        set({ posts: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_categories') {
                      if (JSON.stringify(currentState.categories) !== JSON.stringify(updatedRow.value)) {
                        set({ categories: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_comments') {
                      if (JSON.stringify(currentState.comments) !== JSON.stringify(updatedRow.value)) {
                        set({ comments: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_users') {
                      if (JSON.stringify(currentState.users) !== JSON.stringify(updatedRow.value)) {
                        set({ users: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_settings') {
                      if (JSON.stringify(currentState.settings) !== JSON.stringify(updatedRow.value)) {
                        set({ settings: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_notifications') {
                      if (JSON.stringify(currentState.notifications) !== JSON.stringify(updatedRow.value)) {
                        set({ notifications: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_media') {
                      if (JSON.stringify(currentState.media) !== JSON.stringify(updatedRow.value)) {
                        set({ media: updatedRow.value });
                      }
                    } else if (updatedRow.key === 'cms_followers') {
                      if (JSON.stringify(currentState.followers) !== JSON.stringify(updatedRow.value)) {
                        let newCurrent = currentState.currentFollower;
                        if (currentState.currentFollower) {
                          const updatedSelf = updatedRow.value.find((f: any) => f.id === currentState.currentFollower?.id);
                          if (updatedSelf) {
                            newCurrent = updatedSelf;
                          }
                        }
                        set({ followers: updatedRow.value, currentFollower: newCurrent });
                      }
                    }
                  }
                }
              )
              .subscribe();
          } else {
            posts = loadFromLocalStorage('cms_posts', initialData.posts);
            categories = loadFromLocalStorage('cms_categories', initialData.categories);
            comments = loadFromLocalStorage('cms_comments', initialData.comments);
            users = loadFromLocalStorage('cms_users', initialData.users);
            settings = loadFromLocalStorage('cms_settings', initialData.settings);
            notifications = loadFromLocalStorage('cms_notifications', initialData.notifications);
            media = loadFromLocalStorage('cms_media', initialData.media);
            followers = loadFromLocalStorage('cms_followers', []);
          }

          if (typeof window !== 'undefined') {
            currentFollower = loadFromLocalStorage('cms_current_follower', null);
          }

          set({
            posts,
            categories,
            comments,
            users,
            settings,
            notifications,
            media,
            followers,
            currentFollower,
            isInitialized: true,
          });
        } catch (err) {
          console.error('Failed to initialize store:', err);
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
  let prevFollowers = useAdminStore.getState().followers;
  let prevCurrentFollower = useAdminStore.getState().currentFollower;

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
      prevFollowers = state.followers;
      prevCurrentFollower = state.currentFollower;
      return;
    }

    const save = (key: string, value: any) => {
      if (supabase) {
        saveToSupabase(key, value);
      } else {
        saveToLocalStorage(key, value);
      }
    };

    if (state.posts !== prevPosts) {
      prevPosts = state.posts;
      save('cms_posts', state.posts);
    }
    if (state.categories !== prevCategories) {
      prevCategories = state.categories;
      save('cms_categories', state.categories);
    }
    if (state.comments !== prevComments) {
      prevComments = state.comments;
      save('cms_comments', state.comments);
    }
    if (state.users !== prevUsers) {
      prevUsers = state.users;
      save('cms_users', state.users);
    }
    if (state.settings !== prevSettings) {
      prevSettings = state.settings;
      save('cms_settings', state.settings);
    }
    if (state.notifications !== prevNotifications) {
      prevNotifications = state.notifications;
      save('cms_notifications', state.notifications);
    }
    if (state.media !== prevMedia) {
      prevMedia = state.media;
      save('cms_media', state.media);
    }
    if (state.followers !== prevFollowers) {
      prevFollowers = state.followers;
      save('cms_followers', state.followers);
    }
    if (state.currentFollower !== prevCurrentFollower) {
      prevCurrentFollower = state.currentFollower;
      saveToLocalStorage('cms_current_follower', state.currentFollower);
    }
  });
}

