'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Code, Cpu, Database, Palette, BookOpen } from 'lucide-react';
import { Github, Linkedin, Twitter } from './BrandIcons';

const teamMembers = [
  {
    name: 'Ayushi Awasthi',
    role: 'Team Lead & Full-Stack Developer',
    skills: ['Next.js', 'React', 'Node.js', 'Project Management', 'Frontend Development'],
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
      email: 'mailto:ayushi@example.com'
    },
    icon: <Code className="h-5 w-5 text-blue-500" />,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    name: 'Astha Patel',
    role: 'UI/UX Designer',
    skills: ['Figma', 'UI Design', 'UX Research', 'Wireframing', 'Responsive Design'],
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
      email: 'mailto:astha@example.com'
    },
    icon: <Palette className="h-5 w-5 text-pink-500" />,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    name: 'Anshika Singh',
    role: 'Backend Developer',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'Firebase', 'API Integration'],
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
      email: 'mailto:anshika@example.com'
    },
    icon: <Database className="h-5 w-5 text-emerald-500" />,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'Ayush Jaiswal',
    role: 'Research & Documentation',
    skills: ['Research', 'Documentation', 'Data Analysis', 'Problem Solving', 'Technical Writing'],
    social: {
      github: '#',
      linkedin: '#',
      twitter: '#',
      email: 'mailto:ayush@example.com'
    },
    icon: <BookOpen className="h-5 w-5 text-purple-500" />,
    gradient: 'from-purple-500 to-indigo-500'
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-slate-50 dark:bg-gray-950/40 relative overflow-hidden border-t border-slate-200/50 dark:border-slate-900/50">
      {/* Background glowing rings */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 dark:bg-blue-500/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-500">
            Meet the Team
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Team Hackaholics
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            A diverse group of developers, data scientists, and designers working together to build smart solutions for educational automation.
          </p>
        </div>

        {/* Team Member Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 shadow-sm glassmorphism-hover flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top gradient blur border overlay */}
              <div className={`absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r ${member.gradient}`} />

              <div className="space-y-6">
                {/* Avatar Placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 flex items-center justify-center shadow-sm relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${member.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
                  {member.icon}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {member.role}
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/20 dark:border-slate-700/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Icons Footer */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-850">
                <a href={member.social.github} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <Github className="h-4.5 w-4.5" />
                </a>
                <a href={member.social.linkedin} className="text-slate-400 hover:text-blue-500 transition-colors">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
                <a href={member.social.twitter} className="text-slate-400 hover:text-blue-400 transition-colors">
                  <Twitter className="h-4.5 w-4.5" />
                </a>
                <a href={member.social.email} className="text-slate-400 hover:text-rose-500 transition-colors ml-auto">
                  <Mail className="h-4.5 w-4.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
