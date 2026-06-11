'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, Server, Database, Brain, Key, Map 
} from 'lucide-react';

const techCategories = [
  {
    category: 'Frontend Ecosystem',
    icon: <Layout className="h-6 w-6 text-blue-500" />,
    color: 'border-blue-500/20 shadow-blue-500/5 hover:border-blue-500/30',
    techs: [
      { name: 'Next.js 14', detail: 'App Router architecture for optimized loading and server rendering.' },
      { name: 'React.js', detail: 'Component-driven reactive user interfaces.' },
      { name: 'Tailwind CSS', detail: 'Responsive, premium glassmorphism layouts.' },
      { name: 'Framer Motion', detail: 'Hardware-accelerated fluid micro-animations.' },
    ],
  },
  {
    category: 'Backend Architecture',
    icon: <Server className="h-6 w-6 text-purple-500" />,
    color: 'border-purple-500/20 shadow-purple-500/5 hover:border-purple-500/30',
    techs: [
      { name: 'Node.js', detail: 'Asynchronous server runtime for scaling client requests.' },
      { name: 'Express.js', detail: 'RESTful API handlers routing attendance verifications.' },
    ],
  },
  {
    category: 'Database & Storage',
    icon: <Database className="h-6 w-6 text-emerald-500" />,
    color: 'border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-500/30',
    techs: [
      { name: 'MongoDB Atlas', detail: 'NoSQL storage for flexible student records and logs.' },
      { name: 'Firebase Firestore', detail: 'Real-time database sync for instant dashboard feeds.' },
    ],
  },
  {
    category: 'AI / Computer Vision',
    icon: <Brain className="h-6 w-6 text-cyan-500" />,
    color: 'border-cyan-500/20 shadow-cyan-500/5 hover:border-cyan-500/30',
    techs: [
      { name: 'Face Recognition API', detail: 'Facial landmarks embedding comparison.' },
      { name: 'OpenCV', detail: 'Image pre-processing, contrast tuning, and crop guides.' },
      { name: 'TensorFlow.js', detail: 'Client-side liveness blink detection algorithms.' },
    ],
  },
  {
    category: 'Secure Authentication',
    icon: <Key className="h-6 w-6 text-amber-500" />,
    color: 'border-amber-500/20 shadow-amber-500/5 hover:border-amber-500/30',
    techs: [
      { name: 'JSON Web Token (JWT)', detail: 'State-free session tokens securing API endpoints.' },
      { name: 'Firebase Auth / OAuth', detail: 'Federated credentials and secure profile logins.' },
    ],
  },
  {
    category: 'Geospatial / Mapping',
    icon: <Map className="h-6 w-6 text-pink-500" />,
    color: 'border-pink-500/20 shadow-pink-500/5 hover:border-pink-500/30',
    techs: [
      { name: 'HTML5 Geolocation API', detail: 'Acquires high-precision device GPS coordinates.' },
      { name: 'Haversine Geofencing', detail: 'Calculates mathematical distance to block proxy attempts.' },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/3 dark:bg-purple-500/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/3 dark:bg-blue-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">
            System Stack
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Our Technology Ecosystem
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Built using modern, robust frameworks and cutting-edge libraries to ensure system speed, biometrics encryption, and live dashboards.
          </p>
        </div>

        {/* Tech Stack Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((cat, idx) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className={`p-6 sm:p-8 rounded-3xl border bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-300 flex flex-col justify-between ${cat.color}`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm">
                    {cat.icon}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    {cat.category}
                  </h3>
                </div>

                {/* Sublist */}
                <div className="space-y-4">
                  {cat.techs.map((tech) => (
                    <div key={tech.name} className="space-y-1">
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-200">
                        {tech.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {tech.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
