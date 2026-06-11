'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { School, MapPin, Scan, CheckSquare, Database, LayoutDashboard } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: <School className="h-6 w-6" />,
    title: 'Enter Classroom / Campus',
    desc: 'The student enters the physical perimeter of the campus or designated lecture hall with their smartphone.',
    color: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/10'
  },
  {
    step: '02',
    icon: <MapPin className="h-6 w-6" />,
    title: 'Geofencing Location Verification',
    desc: 'The system validates the GPS coordinates of the student against the active lecture hall coordinates to confirm physical presence.',
    color: 'from-purple-500 to-indigo-500',
    shadow: 'shadow-purple-500/10'
  },
  {
    step: '03',
    icon: <Scan className="h-6 w-6" />,
    title: 'Biometric Face Recognition Scan',
    desc: 'Student opens the app to scan their face. The AI matches facial landmarks and confirms liveness (anti-proxy protection).',
    color: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/10'
  },
  {
    step: '04',
    icon: <CheckSquare className="h-6 w-6" />,
    title: 'Attendance Automatically Marked',
    desc: 'Upon successful biometric and location matching, the student is marked as "Present" with a timestamp.',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/10'
  },
  {
    step: '05',
    icon: <Database className="h-6 w-6" />,
    title: 'Secure Cloud Log Storage',
    desc: 'The data is stored securely in encrypted cloud databases. Reports are instantly generated for audit trails.',
    color: 'from-indigo-500 to-pink-500',
    shadow: 'shadow-indigo-500/10'
  },
  {
    step: '06',
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: 'Instant Dashboard Synced',
    desc: 'The admin dashboard updates in real-time, showing live counts and flagging defaulters automatically.',
    color: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/10'
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/3 dark:bg-blue-500/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/3 dark:bg-purple-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-500">
            The Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            How The System Works
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            A seamless, automatic process completed in seconds. Here is the step-by-step journey of an attendance log entry.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Vertical central bar (visible on desktop) */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12 md:space-y-20">
            {steps.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={item.title} 
                  className={`flex flex-col md:flex-row items-center relative ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge (Center Dot) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-25">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.color} text-white font-extrabold flex items-center justify-center shadow-lg ${item.shadow}`}>
                      {item.step}
                    </div>
                  </div>

                  {/* Empty Spacer Column on Desktop */}
                  <div className="w-full md:w-1/2" />

                  {/* Card Content Column */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-55px' }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="w-full md:w-1/2 px-0 md:px-12 mt-6 md:mt-0"
                  >
                    <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 hover:border-purple-500/25 dark:hover:border-purple-500/20 shadow-sm transition-all duration-300 relative group overflow-hidden">
                      {/* Accent glow corner */}
                      <div className={`absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-gradient-to-tr ${item.color} opacity-10 blur-xl group-hover:opacity-25 transition-opacity duration-300`} />
                      
                      {/* Mobile Step Badge */}
                      <div className="flex md:hidden items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${item.color} text-white`}>
                          Step {item.step}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-md ${item.shadow}`}>
                          {item.icon}
                        </div>
                        <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
