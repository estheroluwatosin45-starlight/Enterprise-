'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Default to true for SSR safety
  const [logs, setLogs] = useState<string[]>([]);

  const allLogs = [
    { threshold: 4, text: 'SECURE HANDSHAKE STARTED' },
    { threshold: 12, text: 'DECRYPTING CLIENT STORAGE' },
    { threshold: 22, text: 'ESTABLISHING DATABASE CONNECTION' },
    { threshold: 34, text: 'SYNCHRONIZING CONTENT FEEDS' },
    { threshold: 45, text: 'VERIFYING SECURITY TOKENS' },
    { threshold: 56, text: 'LOADING MEDIA ASSETS LIBRARY' },
    { threshold: 68, text: 'COMPILING DESIGN SYSTEM STACKS' },
    { threshold: 78, text: 'RESOLVING NAVIGATION ROUTERS' },
    { threshold: 88, text: 'OPTIMIZING VIEWPORT VIEWPORTS' },
    { threshold: 96, text: 'CORE INTEGRITY CHECK: NOMINAL' },
  ];

  useEffect(() => {
    // Show preloader on every mount/reload and lock body scroll
    setIsHidden(false);
    document.body.style.overflow = 'hidden';

    // Organic loading progress simulation over exactly 10 seconds
    let currentProgress = 0;
    const duration = 9400; // ~9.4s total animation time
    const intervalTime = 20; // 50fps
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      // Add very small organic increments
      currentProgress += step + Math.random() * 0.05;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        
        // Hold at 100% for a brief moment, then fade out
        setTimeout(() => {
          setIsFading(true);
          
          // Unmount and restore scroll after fade-out transition completes
          setTimeout(() => {
            setIsHidden(true);
            document.body.style.overflow = '';
          }, 800); // 800ms fade transition duration (slower, more elegant)
        }, 400);
      }
      setProgress(Math.min(100, Math.floor(currentProgress)));
    }, intervalTime);

    // Fail-safe self-destruction timer (max 11.5s)
    const failSafe = setTimeout(() => {
      clearInterval(timer);
      setIsFading(true);
      setTimeout(() => {
        setIsHidden(true);
        document.body.style.overflow = '';
      }, 800);
    }, 11500);

    return () => {
      clearInterval(timer);
      clearTimeout(failSafe);
      document.body.style.overflow = '';
    };
  }, []);

  // Update logging messages as progress increases
  useEffect(() => {
    const visibleLogs = allLogs.filter(log => progress >= log.threshold);
    if (visibleLogs.length > logs.length) {
      const newLog = visibleLogs[visibleLogs.length - 1];
      setLogs(prev => [...prev, newLog.text]);
    }
  }, [progress]);

  if (isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden bg-slate-955 text-white transition-all duration-750 ease-in-out ${
        isFading 
          ? 'opacity-0 scale-[1.08] pointer-events-none' 
          : 'opacity-100 scale-100 bg-slate-950'
      }`}
    >
      {/* Premium Sci-fi Aurora Radial Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/30 blur-[150px] animate-aurora-1" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/25 blur-[150px] animate-aurora-2" />
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] animate-aurora-3" />
      </div>

      {/* Cyberpunk Scanner Line */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-10 bg-scan-grid bg-[size:30px_30px]" />
      <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent top-0 left-0 animate-scan z-1" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Animated Cyber HUD + Logo */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          
          {/* Outer Rotating HUD Dashed Ring */}
          <svg className="absolute w-full h-full animate-hud-rotate-clockwise text-primary-500/30" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 14" fill="none" />
          </svg>

          {/* Inner Counter-Rotating HUD Dashed Ring */}
          <svg className="absolute w-[85%] h-[85%] animate-hud-rotate-counter text-indigo-400/30" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="1" strokeDasharray="30 10 10 10" fill="none" />
          </svg>
          
          {/* Third Tiny Tech Rings */}
          <svg className="absolute w-[70%] h-[70%] text-emerald-500/20" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="150 15" fill="none" />
          </svg>

          {/* Pulsing Central Glow */}
          <div className="absolute w-20 h-20 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-full blur-xl opacity-30 animate-pulse-glow" />

          {/* Logo SVG (Larger and glowing) */}
          <svg viewBox="0 0 120 120" className="w-16 h-16 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M60 10 L105 35 L105 85 L60 110 L15 85 L15 35 Z" 
              stroke="url(#billionHexGradient)" 
              strokeWidth="8" 
              strokeLinejoin="round"
              className="animate-logo-draw"
              strokeDasharray="360"
              strokeDashoffset="0"
            />
            <path 
              d="M48 40 L76 40 L76 50 L58 50 L58 55 L70 55 L70 65 L58 65 L58 70 L76 70 L76 80 L48 80 Z" 
              fill="url(#billionEGradient)"
            />
            <defs>
              <linearGradient id="billionHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc"/> {/* Light purple */}
                <stop offset="50%" stopColor="#38bdf8"/> {/* Cyan */}
                <stop offset="100%" stopColor="#34d399"/> {/* Emerald */}
              </linearGradient>
              <linearGradient id="billionEGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8"/>
                <stop offset="100%" stopColor="#c084fc"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name with Glow Sweep */}
        <div className="space-y-2">
          <h2 className="font-display font-black text-4xl tracking-[0.25em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-white bg-[size:200%_auto] animate-text-glow-sweep pl-[0.25em]">
            Enterprise
          </h2>
        </div>

        {/* Sci-Fi Loading Progress Section */}
        <div className="w-64 space-y-3 pt-2">
          
          {/* High-End Loading Slider */}
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
            {/* Pulsing gradient active track */}
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Laser light tip */}
              {progress > 0 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-xs shadow-[0_0_10px_#fff,_0_0_20px_#0284c7] animate-pulse" />
              )}
            </div>
          </div>
          
          {/* Info row */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYS: ONLINE</span>
            </div>
            <span className="text-primary-400">{progress}%</span>
          </div>
        </div>

        {/* Mock Live Terminal Log Console */}
        <div className="w-80 h-28 bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-left font-mono text-[9px] text-slate-500 space-y-1.5 overflow-hidden shadow-inner relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/60 pointer-events-none" />
          
          {/* Scrollable logs */}
          <div className="space-y-1">
            {logs.slice(-4).map((log, idx) => (
              <div key={idx} className="flex gap-2 items-center text-slate-400 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <span className="text-emerald-500">✓</span>
                <span className="text-slate-400">{log}</span>
              </div>
            ))}
            {progress < 100 ? (
              <div className="flex gap-2 items-center text-primary-400">
                <span className="animate-pulse">❯</span>
                <span className="truncate">PROCESSING CORE MODULES...</span>
                <span className="w-1 h-3 bg-primary-400 animate-terminal-cursor inline-block" />
              </div>
            ) : (
              <div className="flex gap-2 items-center text-emerald-400">
                <span>❯</span>
                <span>SYSTEM NOMINAL. INITIALIZING WORKSPACE.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Embedded CSS for Premium Keyframe Animations */}
      <style jsx global>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15%, 10%) scale(1.1); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, -15%) scale(1.05); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(10%, -5%) scale(1.2) rotate(180deg); }
        }
        @keyframes scan {
          0% { top: -2%; }
          50% { top: 102%; }
          100% { top: -2%; }
        }
        @keyframes hud-rotate-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hud-rotate-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
        @keyframes text-glow-sweep {
          0% { bg-position: 0% 50%; }
          50% { bg-position: 100% 50%; }
          100% { bg-position: 0% 50%; }
        }
        @keyframes logo-draw {
          0% { stroke-dashoffset: 360; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes terminal-cursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .animate-aurora-1 { animation: aurora-1 25s infinite ease-in-out; }
        .animate-aurora-2 { animation: aurora-2 20s infinite ease-in-out; }
        .animate-aurora-3 { animation: aurora-3 30s infinite ease-in-out; }
        .animate-scan { animation: scan 3s infinite linear; }
        .animate-hud-rotate-clockwise { animation: hud-rotate-cw 12s infinite linear; transform-origin: center; }
        .animate-hud-rotate-counter { animation: hud-rotate-ccw 8s infinite linear; transform-origin: center; }
        .animate-pulse-glow { animation: pulse-glow 3s infinite ease-in-out; }
        .animate-text-glow-sweep { animation: text-glow-sweep 3s infinite linear; }
        .animate-logo-draw { animation: logo-draw 3s infinite ease-in-out; }
        .animate-terminal-cursor { animation: terminal-cursor 1s infinite steps(2); }
        
        .bg-scan-grid {
          background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
