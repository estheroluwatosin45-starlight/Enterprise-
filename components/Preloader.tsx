'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Default to true for SSR safety

  useEffect(() => {
    // Check session storage to see if preloader has already run in this session
    const hasVisited = sessionStorage.getItem('has-visited-enterprise-cms');
    if (hasVisited) {
      return;
    }

    // It's the first visit, so display it and lock body scroll
    setIsHidden(false);
    document.body.style.overflow = 'hidden';

    // Organic loading progress simulation
    let currentProgress = 0;
    const duration = 1200; // 1.2s total animation time
    const intervalTime = 16; // ~60fps
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      // Add random small jumps to make the loading feel organic
      currentProgress += step + Math.random() * 3.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        // Hold at 100% for a brief moment, then fade out
        setTimeout(() => {
          setIsFading(true);
          sessionStorage.setItem('has-visited-enterprise-cms', 'true');
          
          // Unmount and restore scroll after fade-out transition completes
          setTimeout(() => {
            setIsHidden(true);
            document.body.style.overflow = '';
          }, 500); // 500ms fade transition duration
        }, 150);
      }
      setProgress(Math.min(100, Math.floor(currentProgress)));
    }, intervalTime);

    // Fail-safe self-destruction timer (max 2.8s)
    const failSafe = setTimeout(() => {
      clearInterval(timer);
      setIsFading(true);
      setTimeout(() => {
        setIsHidden(true);
        document.body.style.overflow = '';
      }, 500);
    }, 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(failSafe);
      document.body.style.overflow = '';
    };
  }, []);

  if (isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ease-out select-none ${
        isFading 
          ? 'opacity-0 scale-[1.03] pointer-events-none' 
          : 'opacity-100 scale-100 bg-slate-50 dark:bg-slate-950'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.07) 0%, transparent 65%)'
      }}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Animated Brand Logo Symbol */}
        <div className="relative group">
          {/* Pulsing Outer Glow */}
          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/35 transition-all duration-700 animate-pulse scale-110" />
          
          <svg viewBox="0 0 120 120" className="w-20 h-20 relative z-10 drop-shadow-2xl animate-in duration-1000 spin-in-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M60 10 L105 35 L105 85 L60 110 L15 85 L15 35 Z" 
              stroke="url(#preloaderHexGradient)" 
              strokeWidth="8" 
              strokeLinejoin="round"
              className="animate-pulse"
            />
            <path 
              d="M48 40 L76 40 L76 50 L58 50 L58 55 L70 55 L70 65 L58 65 L58 70 L76 70 L76 80 L48 80 Z" 
              fill="url(#preloaderEGradient)"
            />
            <defs>
              <linearGradient id="preloaderHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="50%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#10b981"/>
              </linearGradient>
              <linearGradient id="preloaderEGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name */}
        <div className="space-y-1.5">
          <h2 className="font-display font-black text-3xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-600 to-indigo-600 dark:from-white dark:via-primary-400 dark:to-indigo-400">
            Enterprise
          </h2>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500 block">
            Content Management System
          </span>
        </div>

        {/* Loading Progress Bar Container */}
        <div className="w-48 space-y-2 pt-2">
          {/* Progress Tracker Bar */}
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative border border-slate-200/10">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Percentage */}
          <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            {progress}%
          </span>
        </div>

      </div>
    </div>
  );
}
