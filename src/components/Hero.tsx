'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ScanFace, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';

export default function Hero() {
  const handleScrollToProblem = () => {
    const element = document.querySelector('#problem');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden dot-grid dark:bg-gray-950"
    >
      {/* Decorative Radial Glowing Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600/10 dark:bg-purple-600/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 dark:bg-blue-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Text Left Column */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Smart India Hackathon 2026 Project
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
            >
              Smarter Attendance, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">
                Smarter Education
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              An AI-powered attendance management system using face recognition, geofencing, and smart verification for accurate, secure, and automated attendance tracking.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-blue-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Live Demo <Play className="h-4 w-4 fill-white" />
            </Link>
            <button
              onClick={handleScrollToProblem}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Project <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Mini Stats Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-900 max-w-lg mx-auto lg:mx-0"
          >
            <div>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">99.8%</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">AI Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">&lt; 2s</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Scan Speed</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-cyan-500">0%</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Proxy Rate</p>
            </div>
          </motion.div>
        </div>

        {/* Animation Visual Right Column */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Main Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[400px] aspect-square rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-gray-900/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center shadow-2xl shadow-blue-500/5"
          >
            {/* Mesh grid background inside */}
            <div className="absolute inset-0 grid-mesh opacity-30 pointer-events-none" />

            {/* Scanline line overlay */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline z-20 shadow-[0_0_12px_#22d3ee]" />

            {/* Futuristic Face Silhouette */}
            <div className="relative z-10 w-48 h-48 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center overflow-hidden">
              {/* Bounding box corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
              
              <ScanFace className="w-24 h-24 text-blue-500/40 dark:text-blue-400/30 animate-pulse-slow" />
              
              {/* Green Face Mapping node points (SVG) */}
              <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 100 100">
                <circle cx="50" cy="35" r="1.5" className="fill-current animate-ping" />
                <circle cx="50" cy="35" r="1" className="fill-current" />
                
                <circle cx="40" cy="45" r="1" className="fill-current" />
                <circle cx="60" cy="45" r="1" className="fill-current" />
                
                <circle cx="50" cy="55" r="1" className="fill-current" />
                
                <circle cx="43" cy="65" r="1.5" className="fill-current animate-ping" />
                <circle cx="43" cy="65" r="1" className="fill-current" />
                <circle cx="57" cy="65" r="1" className="fill-current" />
                
                {/* Connecting lines */}
                <line x1="50" y1="35" x2="40" y2="45" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="50" y1="35" x2="60" y2="45" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="40" y1="45" x2="50" y2="55" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="60" y1="45" x2="50" y2="55" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="50" y1="55" x2="43" y2="65" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="50" y1="55" x2="57" y2="65" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                <line x1="43" y1="65" x2="57" y2="65" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Verification HUD Indicators */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 z-10 bg-white/40 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="space-y-1">
                <p>STATUS: <span className="text-emerald-500 font-bold">MATCH</span></p>
                <p>BIOMETRICS: OK</p>
              </div>
              <div className="space-y-1 text-right">
                <p>LAT: 23.2599° N</p>
                <p>LON: 77.4126° E</p>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Card 1: Geofence Success */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -right-6 top-8 glassmorphism p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-[190px] border border-slate-200/50 dark:border-slate-800/60 z-30 animate-float"
          >
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Geofence</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100">Location Verified</p>
            </div>
          </motion.div>

          {/* Floating UI Card 2: Logs updates */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -left-6 bottom-12 glassmorphism p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-[210px] border border-slate-200/50 dark:border-slate-800/60 z-30 animate-float-delayed"
          >
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <CheckCircle className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Attendance Log</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="font-bold text-blue-500">Ayushi</span> marked present
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
