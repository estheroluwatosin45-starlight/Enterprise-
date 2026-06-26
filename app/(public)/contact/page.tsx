'use client';

import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, subject, message } = formData;
    
    const text = `*New Contact Request*\n*Name:* ${firstName} ${lastName}\n*Email:* ${email}\n*Subject:* ${subject}\n\n*Message:*\n${message}`;
    
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/2347034698586?text=${encodedText}`;
    
    // Try window.open first, fallback to location href if blocked by iframe
    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow) {
      window.location.href = whatsappUrl;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Have questions about the platform? Reach out to our team.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="glass p-8 md:p-12 rounded-3xl relative">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-colors" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea required rows={5} name="message" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-colors resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-md text-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Submit via WhatsApp
            </button>
          </form>
        </div>
        
        <div className="space-y-8">
          <a href="https://maps.google.com/?q=123+Innovation+Drive,+San+Francisco,+CA+94103" target="_blank" rel="noopener noreferrer" className="block glass p-8 rounded-3xl relative overflow-hidden h-64 group">
             {/* Mock map via an image for speed */}
             <div className="absolute inset-0 bg-slate-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
               <span className="text-slate-500 font-medium flex items-center gap-2">
                 <MapPin className="w-5 h-5" />
                 View on Google Maps
                 <ExternalLink className="w-4 h-4" />
               </span>
             </div>
             <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                 <MapPin className="text-indigo-600 w-5 h-5" />
               </div>
               <div>
                 <p className="font-semibold text-slate-900 text-sm">Headquarters</p>
                 <p className="text-slate-500 text-sm font-medium">123 Innovation Drive, SF, CA 94103</p>
               </div>
             </div>
          </a>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="mailto:hello@enterprisecms.com" className="block glass p-6 rounded-2xl hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-500 font-medium text-sm">hello@enterprisecms.com</p>
                  <p className="text-slate-500 font-medium text-sm">support@enterprisecms.com</p>
                </div>
              </div>
            </a>
            <a href="tel:+18001234567" className="block glass p-6 rounded-2xl hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-500 font-medium text-sm">+1 (800) 123-4567</p>
                  <p className="text-slate-500 font-medium text-sm text-xs mt-1">Mon-Fri, 9am-6pm PST</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
