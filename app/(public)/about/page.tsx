'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAdminStore } from '@/store/adminStore';

export default function AboutPage() {
  const settings = useAdminStore((state) => state.settings);

  const team = [
    { name: settings?.ceoName || 'Babatunde Funmilayo', title: 'CEO & Founder', seed: settings?.ceoSeed || 'babatunde' },
    { name: settings?.chiefEditorName || '', title: 'Chief Editor', seed: settings?.chiefEditorSeed || 'sarah' },
    { name: settings?.leadArchitectName || '', title: 'Lead Architect', seed: settings?.leadArchitectSeed || 'david' },
    { name: settings?.headOfDesignName || '', title: 'Head of Design', seed: settings?.headOfDesignSeed || 'elena' },
  ].filter(member => member.name && member.name.trim() !== '');

  return (
    <div className="w-full">
      <div className="bg-slate-900 text-white py-20 text-center relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-4 relative z-10">
           <h1 className="text-5xl font-display font-bold mb-6">Our Mission</h1>
           <p className="text-xl text-slate-300">Empowering creators and organizations to share their stories with elegant, high-performance web technology.</p>
         </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Who We Are</h2>
            <p className="text-lg text-slate-600 mb-4">
              Enterprise CMS was born out of frustration with legacy platforms that were either too complex to use, or too rigid to customize. We wanted a system that developers love building with, and editors love writing in.
            </p>
            <p className="text-lg text-slate-600 mb-6">
              Today, our platform serves millions of page views daily, powered by Next.js and Supabase, providing a seamless edge network experience globally.
            </p>
            <Link href="/contact" className="text-primary-600 font-semibold hover:text-primary-700 text-lg">
              Get in touch with us &rarr;
            </Link>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden glass p-2">
            <Image src="https://picsum.photos/seed/teamwork/1000/1200" alt="Our Team" fill className="object-cover rounded-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-12">Meet the Leadership</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map(member => (
              <div key={member.name} className="glass p-6 rounded-2xl flex flex-col items-center w-full max-w-[280px] border border-white/40 dark:border-slate-800/40">
                <div className="w-32 h-32 rounded-full overflow-hidden relative mb-4 shadow-md bg-slate-100">
                   <Image src={`https://picsum.photos/seed/${member.seed}/300/300`} alt={member.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-primary-600 text-sm font-semibold mt-1">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
