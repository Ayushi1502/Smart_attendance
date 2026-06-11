'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, FileText, AlertOctagon } from 'lucide-react';

const wastedTimeData = [
  { students: '30 Students', traditional: 7, automated: 0.5 },
  { students: '60 Students', traditional: 14, automated: 0.8 },
  { students: '90 Students', traditional: 20, automated: 1.2 },
  { students: '120 Students', traditional: 28, automated: 1.5 },
];

const problems = [
  {
    icon: <Users className="h-6 w-6 text-red-500" />,
    title: 'Proxy Attendance',
    desc: 'Students calling out rolls or scanning backup cards for absent classmates. Up to 15-20% of manually tracked classes contain proxy records.',
  },
  {
    icon: <Clock className="h-6 w-6 text-orange-500" />,
    title: 'Time-Consuming Process',
    desc: 'Calling out 60+ names takes 12-15 minutes. Over a semester, this translates to dozens of hours of lost instruction time per course.',
  },
  {
    icon: <AlertOctagon className="h-6 w-6 text-yellow-500" />,
    title: 'Manual Entry Errors',
    desc: 'Human oversight, mishearings, and clerical errors during manual entry into spreadsheets lead to incorrect calculations and disputes.',
  },
  {
    icon: <FileText className="h-6 w-6 text-slate-500" />,
    title: 'Physical Paper Overhead',
    desc: 'Printing, signing, signing backups, and physical storage of paper registers is logistically inefficient, insecure, and bad for the environment.',
  },
];

export default function Problem() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="problem" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-red-500/3 dark:bg-red-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">
            The Problem Statement
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Why Traditional Attendance is Broken
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Manual roll calls and paper-based tracking are remnants of the past. They waste valuable academic hours, are highly susceptible to manipulation, and lack data visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* List of Problems Left Column */}
          <div className="lg:col-span-6 space-y-6">
            {problems.map((prob, idx) => (
              <motion.div
                key={prob.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 hover:border-red-500/20 dark:hover:border-red-500/20 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm flex-shrink-0">
                  {prob.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                    {prob.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {prob.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Recharts Chart Right Column */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2 mb-6">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Statistical Impact
                </span>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">
                  Time Spent Marking Attendance
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Comparison of minutes spent marking attendance per lecture (Traditional Roll Call vs. Our AI-based touchless system).
                </p>
              </div>

              {/* Chart Mount check */}
              <div className="h-[280px] w-full text-xs">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={wastedTimeData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="students" stroke="currentColor" className="text-slate-400 dark:text-slate-500" />
                      <YAxis unit="m" stroke="currentColor" className="text-slate-400 dark:text-slate-500" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar name="Traditional Roll Call" dataKey="traditional" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar name="Our Automated AI" dataKey="automated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    Loading statistics...
                  </div>
                )}
              </div>

              {/* Legend & Summary */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
                  <span className="text-slate-600 dark:text-slate-400">Traditional Roll Call</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-400">Our Automated AI</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
