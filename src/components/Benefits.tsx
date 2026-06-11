'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserX, Clock, Target, Eye, GraduationCap, ShieldCheck, Leaf 
} from 'lucide-react';

const stats = [
  { value: '0%', label: 'Proxy Rate', desc: 'Face recognition + GPS locking completely blocks proxy attempts.' },
  { value: '95%', label: 'Time Reduction', desc: 'Speeds up check-ins from 15 minutes to under 2 seconds.' },
  { value: '99.8%', label: 'Scan Accuracy', desc: 'Precision computer vision models ensure reliable identity matches.' },
  { value: '100%', label: 'Paperless Logs', desc: 'Saves thousands of sheets of printed paper logs annually.' },
];

const benefitDetails = [
  {
    icon: <UserX className="h-5 w-5 text-rose-500" />,
    title: 'Zero Proxy Opportunities',
    desc: 'Biometric hashing ensures a student cannot check in for another classmate, solving the biggest loophole in classrooms.',
    bg: 'bg-rose-500/5 dark:bg-rose-500/3',
    border: 'hover:border-rose-500/20'
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    title: 'Recovers Valuable Teaching Hours',
    desc: 'Marks attendance automatically in the background, freeing up to 15% of class time to focus on education.',
    bg: 'bg-blue-500/5 dark:bg-blue-500/3',
    border: 'hover:border-blue-500/20'
  },
  {
    icon: <Target className="h-5 w-5 text-emerald-500" />,
    title: 'Eradicates Manual Entry Errors',
    desc: 'Automates database updates directly from device checks, removing paper mistakes or transfer discrepancies.',
    bg: 'bg-emerald-500/5 dark:bg-emerald-500/3',
    border: 'hover:border-emerald-500/20'
  },
  {
    icon: <Eye className="h-5 w-5 text-amber-500" />,
    title: 'Real-Time Monitoring HUD',
    desc: 'Gives administrators and lecturers live tracking views of present statistics and automatic geofence checks.',
    bg: 'bg-amber-500/5 dark:bg-amber-500/3',
    border: 'hover:border-amber-500/20'
  },
  {
    icon: <GraduationCap className="h-5 w-5 text-indigo-500" />,
    title: 'Improved Academic Analytics',
    desc: 'Tracks historical trends to identify patterns of absenteeism early, helping prevent course dropouts.',
    bg: 'bg-indigo-500/5 dark:bg-indigo-500/3',
    border: 'hover:border-indigo-500/20'
  },
  {
    icon: <Leaf className="h-5 w-5 text-teal-500" />,
    title: 'Environmentally Friendly & Scalable',
    desc: 'Removes physical binders and printer ink, digitizing files into secure backups instantly.',
    bg: 'bg-teal-500/5 dark:bg-teal-500/3',
    border: 'hover:border-teal-500/20'
  },
];

export default function Benefits() {
  return (
    <section id="impact" className="py-24 bg-slate-50 dark:bg-gray-950/40 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/3 dark:bg-cyan-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500">
            Benefits & Impact
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Key Outcomes & System Metrics
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Automating verification delivers measurable improvements in classroom productivity, data validity, and student accountability.
          </p>
        </div>

        {/* Counter Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm text-center space-y-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitDetails.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 transition-all duration-300 flex flex-col justify-between ${benefit.border}`}
            >
              <div className="space-y-4">
                <div className={`p-3 rounded-2xl ${benefit.bg} w-fit shadow-sm`}>
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
