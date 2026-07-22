import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="footer" className="relative border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-100/80 dark:bg-slate-950 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.svg"
                alt="YNC Logo"
                className="w-9 h-9 object-contain rounded-full shadow-sm"
              />
              <span className="text-xl font-extrabold tracking-widest text-slate-800 dark:text-white">
                YNC
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Youth Networking Community (YCN) is a dynamic platform empowering students and young professionals to connect, build leaders, and collaborate on real-world projects.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-2">
              <a href="#" aria-label="Instagram" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <li><a href="#home" className="hover:text-primary transition-colors">Home Landing</a></li>
              <li><a href="#events" className="hover:text-primary transition-colors">Featured Events</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Mission</a></li>
              <li><a href="/recruitment" className="hover:text-primary transition-colors">Team Application</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Collaboration Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Partnerships</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">Contact us</h4>
            <ul className="flex flex-col gap-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                <span className="break-all">info@ycncommunity.org</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary-light shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-light shrink-0 mt-0.5" />
                <span>YCN Head Office, Innovation Hub, Phase 1, Bangalore, IN</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold text-center sm:text-left">
            &copy; {new Date().getFullYear()} YCN (Youth Networking Community). All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500 font-bold">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
