import Link from 'next/link';
import { Edit3, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Edit3 className="w-6 h-6 text-primary-600" />
              <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                Enterprise<span className="text-primary-600">CMS</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm mb-4">
              A premium, high-performance content management system built for scalability and elegance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Articles</Link></li>
              <li><Link href="/categories" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Categories</Link></li>
              <li><Link href="/authors" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Authors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-base text-slate-500 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-base text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 flex items-center justify-between">
          <p className="text-base text-slate-400 xl:text-center">
            &copy; 2026 Enterprise CMS, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
