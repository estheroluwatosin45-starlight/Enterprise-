'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Default to true for SSR safety
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminPath) {
      return;
    }

    // Check if preloader has already run in the current browser tab session
    if (typeof window !== 'undefined' && (window as any).__PRELOADER_RAN__) {
      return;
    }

    // Show preloader on every mount/reload and lock body scroll
    setIsHidden(false);
    document.body.style.overflow = 'hidden';

    // Organic loading progress simulation over exactly 10 seconds
    let currentProgress = 0;
    const duration = 9400; // ~9.4s animation time + 600ms holds & fades
    const intervalTime = 20; // 50fps
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      // Add very small organic increments to reach 100% in ~10 seconds
      currentProgress += step + Math.random() * 0.05;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        // Hold at 100% for a brief moment, then fade out
        setTimeout(() => {
          setIsFading(true);
          
          if (typeof window !== 'undefined') {
            (window as any).__PRELOADER_RAN__ = true;
          }
          
          // Unmount and restore scroll after fade-out transition completes
          setTimeout(() => {
            setIsHidden(true);
            document.body.style.overflow = '';
          }, 600); // 600ms fade transition duration
        }, 300);
      }
      setProgress(Math.min(100, Math.floor(currentProgress)));
    }, intervalTime);

    // Fail-safe self-destruction timer (max 11.5s)
    const failSafe = setTimeout(() => {
      clearInterval(timer);
      setIsFading(true);
      if (typeof window !== 'undefined') {
        (window as any).__PRELOADER_RAN__ = true;
      }
      setTimeout(() => {
        setIsHidden(true);
        document.body.style.overflow = '';
      }, 600);
    }, 11500);

    return () => {
      clearInterval(timer);
      clearTimeout(failSafe);
      document.body.style.overflow = '';
    };
  }, [isAdminPath]);

  if (isHidden || isAdminPath) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-all duration-700 ease-in-out ${
        isFading 
          ? 'opacity-0 scale-[1.03] pointer-events-none' 
          : 'opacity-100 scale-100 bg-slate-50 dark:bg-slate-950'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.06) 0%, transparent 60%)'
      }}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Animated Brand Logo Symbol */}
        <div className="relative">
          {/* Pulsing Outer Glow */}
          <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-xl animate-pulse scale-110" />
          
          <svg viewBox="0 0 120 120" className="w-16 h-16 relative z-10 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M60 10 L105 35 L105 85 L60 110 L15 85 L15 35 Z" 
              stroke="url(#formalHexGradient)" 
              strokeWidth="9" 
              strokeLinejoin="round"
              className="animate-pulse"
            />
            <path 
              d="M48 40 L76 40 L76 50 L58 50 L58 55 L70 55 L70 65 L58 65 L58 70 L76 70 L76 80 L48 80 Z" 
              fill="url(#formalEGradient)"
            />
            <defs>
              <linearGradient id="formalHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0"/>
                <stop offset="60%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
              <linearGradient id="formalEGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h2 className="font-display font-bold text-3xl tracking-wide text-slate-900 dark:text-white">
            Enterprise
          </h2>
        </div>

        {/* Loading Progress Bar Container */}
        <div className="w-40 space-y-2 pt-2">
          {/* Progress Tracker Bar */}
          <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Percentage */}
          <div className="flex justify-between items-center text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider">
            <span>{progress}%</span>
            <span>LOADING</span>
          </div>
        </div>

      </div>
    </div>
  );
}
