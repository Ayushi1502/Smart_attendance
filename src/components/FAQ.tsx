'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does face recognition work?',
    answer: 'The system uses camera feeds to capture facial images, detects facial landmark points (eyes, nose, mouth), and translates them into a unique 128-dimension vector representation. This mathematical embedding is compared against the stored profile embedding. Hashing coordinates ensures actual photos are never stored, preserving privacy.',
  },
  {
    question: 'Can students fake attendance?',
    answer: 'No, proxy attempts are prevented through multiple defensive layers: (1) Anti-spoofing liveness checks verify blink rates and depth checks to block pictures or videos. (2) GPS Geofencing prevents logging from home or outside the building. (3) Devices are matched to unique hardware IDs, restricting multiple accounts on a single phone.',
  },
  {
    question: 'Is geofencing secure?',
    answer: 'Yes, our geofencing implementation matches coordinates directly on the secure backend server. It checks GPS coordinates using the Haversine formula against the classroom center. Any spoofed mock locations on devices are identified and flagged through API restrictions.',
  },
  {
    question: 'Does it work in real-time?',
    answer: 'Absolutely. The moment a student completes face scanning, the attendance record is sent to our real-time database. The admin dashboard is instantly updated with live logs, and students see a confirmation checkmark in their app.',
  },
  {
    question: 'Is data protected?',
    answer: 'Data security is a core priority. The database does not save actual photos of students. Instead, it stores one-way biometric hash key vectors. All communication uses HTTPS protocols with AES-256 encryption. Database access is guarded behind JWT role authentication filters.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/3 dark:bg-cyan-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-500">
            Support center
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Find answers to common questions about face recognition security, location privacy, databases, and anti-proxy spoof mechanisms.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden transition-all duration-350"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-500' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40 pt-4 bg-white/40 dark:bg-slate-950/20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
