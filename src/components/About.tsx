'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScanFace, MapPin, QrCode, Activity, ShieldCheck, 
  Layout, BarChart3, FileText, Bell, Lock 
} from 'lucide-react';

const features = [
  {
    icon: <ScanFace className="h-6 w-6 text-blue-500" />,
    title: 'Face Recognition Attendance',
    desc: 'AI model scans facial landmarks to confirm student identity in under 2 seconds. Powered by OpenCV and TensorFlow APIs.',
  },
  {
    icon: <MapPin className="h-6 w-6 text-purple-500" />,
    title: 'Geo-Fencing Verification',
    desc: 'Locks attendance scanning to GPS coordinates. Students can only check in if inside the designated campus perimeter.',
  },
  {
    icon: <QrCode className="h-6 w-6 text-cyan-500" />,
    title: 'QR-Based Attendance Backup',
    desc: 'Dynamic, time-limited QR codes projected in class as a fail-safe fallback in case of hardware or network constraints.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
    title: 'Anti-Proxy Liveness Detection',
    desc: 'Prevents spoofing attacks by detecting eye blinks and head movements, blocking photos, videos, or pre-recorded materials.',
  },
  {
    icon: <Activity className="h-6 w-6 text-indigo-500" />,
    title: 'Real-Time Tracking Feed',
    desc: 'Updates class check-ins instantaneously. Admins can view who entered, time details, and geofence coordinates live.',
  },
  {
    icon: <Layout className="h-6 w-6 text-pink-500" />,
    title: 'Student/Admin Portals',
    desc: 'Dedicated dashboards for students to review daily logs, and admins to configure lecture bounds and manage coordinates.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
    title: 'Attendance Analytics',
    desc: 'Subject-wise reports, radar percentage gauges, and predictive insights showing students at risk of falling below attendance limits.',
  },
  {
    icon: <FileText className="h-6 w-6 text-teal-500" />,
    title: 'Automated Reports',
    desc: 'Export logs to CSV, Excel, or PDF with a single click. Schedule automated weekly reports delivered directly to emails.',
  },
  {
    icon: <Bell className="h-6 w-6 text-yellow-500" />,
    title: 'Instant Alerts & Notifications',
    desc: 'Automatically notifies parents and students when attendance milestones are missed or when low levels are flagged.',
  },
  {
    icon: <Lock className="h-6 w-6 text-red-500" />,
    title: 'Secure Encrypted Database',
    desc: 'All biometrics are hashed and stored using advanced encryption algorithms. Zero photo storage protects privacy.',
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-50 dark:bg-gray-950/40 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">
            About the Project
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            An Intelligent Automation Ecosystem
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            A comprehensive hardware-independent solution combining advanced computer vision and geospatial constraints to deliver a tamper-proof and fully automated check-in experience.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 glassmorphism-hover shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm w-fit">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
