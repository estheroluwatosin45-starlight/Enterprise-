export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 120 120" className="w-8 h-8 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 10 L105 35 L105 85 L60 110 L15 85 L15 35 Z" stroke="url(#hexGradient)" strokeWidth="10" strokeLinejoin="round"/>
        <path d="M48 40 L76 40 L76 50 L58 50 L58 55 L70 55 L70 65 L58 65 L58 70 L76 70 L76 80 L48 80 Z" fill="url(#eGradient)"/>
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0"/>
            <stop offset="60%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
          <linearGradient id="eGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="font-display font-bold text-xl tracking-tight text-slate-900">
        Enterprise<span className="text-primary-600">CMS</span>
      </span>
    </div>
  );
}
