'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-gray-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] -translate-y-1/2 rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-3xl" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] -translate-y-1/2 rounded-full bg-purple-500/5 dark:bg-purple-500/3 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Intro */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                Smart<span className="text-blue-500 dark:text-blue-400">Attend</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated, secure, and touchless attendance tracking powered by AI face recognition and precision geofencing. Built for modern educational institutions and enterprises.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
              Project Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Home / Introduction', id: '#home' },
                { name: 'Problem Statement', id: '#problem' },
                { name: 'System Features', id: '#about' },
                { name: 'Work Flowchart', id: '#workflow' },
                { name: 'Impact & Analysis', id: '#impact' },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleScrollToSection(link.id)}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Secondary Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
              Developer Info
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: 'System Stack', id: '#tech' },
                { name: 'Meet Hackaholics', id: '#team' },
                { name: 'Frequently Asked FAQs', id: '#faq' },
                { name: 'Submit Inquiry', id: '#contact' },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleScrollToSection(link.id)}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  href="/demo"
                  className="text-sm flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Interactive Simulator <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Team / Hackathon details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider">
              Hackathon Entry
            </h3>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 space-y-2 shadow-sm">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Team Name
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Hackaholics
              </p>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pt-2">
                Team Lead
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Ayushi Awasthi
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                  SIH 2026 Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {currentYear} Team Hackaholics. All rights reserved. Made for SIH & MP Hackathon presentation.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            Designed with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Smart Education.
          </p>
        </div>
      </div>
    </footer>
  );
}
