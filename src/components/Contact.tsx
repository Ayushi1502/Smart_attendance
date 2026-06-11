'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin, Users, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    let valid = true;
    const tempErrors = { name: '', email: '', subject: '', message: '' };

    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required';
      valid = false;
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email';
      valid = false;
    }
    if (!formData.subject.trim()) {
      tempErrors.subject = 'Subject is required';
      valid = false;
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Message body is required';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-gray-950/40 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 dark:bg-blue-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">
            Get in touch
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact Team Hackaholics
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Have questions about integrations or need to arrange a pilot testing program for your institution? Drop us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100">
                Project Headquarters
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Smart Attendance System is currently undergoing pilot runs across multiple selected campuses. Get technical support or submit documentation requests.
              </p>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Developers</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Team Hackaholics</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Support Email</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">ayushi.sih2026@example.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Presentation Hub</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Smart India Hackathon, India</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
              Response times are typically within 24 business hours.
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm ${
                          errors.name ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'
                        }`}
                        placeholder="Ayushi Awasthi"
                      />
                      {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm ${
                          errors.email ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'
                        }`}
                        placeholder="you@domain.com"
                      />
                      {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm ${
                        errors.subject ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'
                      }`}
                      placeholder="Pilot program integration query"
                    />
                    {errors.subject && <p className="text-[11px] text-red-500 font-medium">{errors.subject}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm resize-none ${
                        errors.message ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'
                      }`}
                      placeholder="Hi Team, we want to integrate SmartAttend in our campus..."
                    />
                    {errors.message && <p className="text-[11px] text-red-500 font-medium">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.01] active:scale-[0.99] text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all disabled:opacity-75 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 space-y-6 flex flex-col items-center"
                >
                  <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shadow-md">
                    <CheckCircle className="h-12 w-12 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                      Thank you for contacting Team Hackaholics. We have received your query and will reply shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-350 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
