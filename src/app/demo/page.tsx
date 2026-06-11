'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanFace, MapPin, CheckCircle, AlertTriangle, Users, BookOpen, 
  Map, Bell, FileSpreadsheet, RefreshCw, User, Camera, ShieldCheck, 
  Search, ShieldAlert, Check, Play, Settings
} from 'lucide-react';
import { 
  ResponsiveContainer, RadialBarChart, RadialBar, 
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid 
} from 'recharts';

// Mock Data
const subjectData = [
  { name: 'Mathematics', attendance: 92, fill: '#3b82f6' },
  { name: 'Computer Science', attendance: 95, fill: '#8b5cf6' },
  { name: 'Physics', attendance: 72, fill: '#ef4444' },
  { name: 'Chemistry', attendance: 85, fill: '#f59e0b' },
];

const initialLogs = [
  { id: '1', date: '2026-06-11', time: '09:02 AM', subject: 'Computer Science', status: 'Present', verified: 'Face + GPS' },
  { id: '2', date: '2026-06-10', time: '10:15 AM', subject: 'Mathematics', status: 'Present', verified: 'Face + GPS' },
  { id: '3', date: '2026-06-09', time: '11:30 AM', subject: 'Physics', status: 'Absent', verified: 'None' },
  { id: '4', date: '2026-06-08', time: '09:05 AM', subject: 'Chemistry', status: 'Present', verified: 'Face + GPS' },
  { id: '5', date: '2026-06-05', time: '09:03 AM', subject: 'Computer Science', status: 'Present', verified: 'Face + GPS' },
];

const attendanceTrends = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 96 },
  { day: 'Wed', rate: 91 },
  { day: 'Thu', rate: 93 },
  { day: 'Fri', rate: 95 },
];

const initialDefaulters = [
  { roll: 'CSE-2026-004', name: 'Raj Patel', attendance: '68%', subject: 'Physics', status: 'Flagged' },
  { roll: 'CSE-2026-018', name: 'Sneha Rao', attendance: '71%', subject: 'Mathematics', status: 'Flagged' },
  { roll: 'CSE-2026-033', name: 'Amit Verma', attendance: '65%', subject: 'Physics', status: 'Flagged' },
  { roll: 'CSE-2026-042', name: 'Kunal Sen', attendance: '73%', subject: 'Chemistry', status: 'Flagged' },
];

const mapStudents = [
  { id: 1, name: 'Ayushi Awasthi (You)', dist: '4m', status: 'inside', cx: 150, cy: 150 },
  { id: 2, name: 'Priya Sharma', dist: '12m', status: 'inside', cx: 120, cy: 190 },
  { id: 3, name: 'Rohan Gupta', dist: '24m', status: 'inside', cx: 210, cy: 110 },
  { id: 4, name: 'Vikram Singh', dist: '38m', status: 'inside', cx: 80, cy: 140 },
  { id: 5, name: 'Raj Patel', dist: '62m', status: 'outside', cx: 40, cy: 60 },
  { id: 6, name: 'Amit Verma', dist: '85m', status: 'outside', cx: 260, cy: 250 },
];

export default function DemoPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Student simulator state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: Start, 1: GPS Verify, 2: Face Recognition, 3: Liveness, 4: Success
  const [studentLogs, setStudentLogs] = useState(initialLogs);
  
  // Admin simulator state
  const [defaulters, setDefaulters] = useState(initialDefaulters);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);
  const [liveFeed, setLiveFeed] = useState<string[]>([
    '02:15 PM - Priya Sharma checked in (CS Lecture Hall)',
    '02:12 PM - Rohan Gupta checked in (CS Lecture Hall)',
    '02:08 PM - Vikram Singh checked in (CS Lecture Hall)',
  ]);

  useEffect(() => {
    setMounted(true);

    // Dynamic feed updates on admin view
    const interval = setInterval(() => {
      const names = ['Karan Johar', 'Neha Dixit', 'Kabir Khan', 'Riya Sen', 'Sufyan Ali'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveFeed((prev) => [`${timeStr} - ${randomName} checked in (CS Lecture Hall)`, ...prev.slice(0, 7)]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Simulator triggering
  const startSimulation = () => {
    setIsModalOpen(true);
    setSimStep(0);
    
    // Step 1: GPS check
    setTimeout(() => {
      setSimStep(1);
      
      // Step 2: Face Scan
      setTimeout(() => {
        setSimStep(2);
        
        // Step 3: Liveness
        setTimeout(() => {
          setSimStep(3);
          
          // Step 4: Success
          setTimeout(() => {
            setSimStep(4);
            // Add to logs
            const today = new Date().toISOString().split('T')[0];
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setStudentLogs((prev) => [
              {
                id: Math.random().toString(),
                date: today,
                time: now,
                subject: 'Computer Science',
                status: 'Present',
                verified: 'Face + GPS'
              },
              ...prev
            ]);
          }, 1800);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const handleSendWarning = (name: string) => {
    setAdminNotification(`Warning alert & low-attendance notifications dispatched to ${name} & parents!`);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 dark:bg-gray-950 dot-grid relative">
        {/* Glow rings */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/2 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 backdrop-blur-md">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                Demo Environment
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
                SmartAttend Control Portal
              </h1>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 w-full sm:w-auto">
              <button
                onClick={() => setIsAdminMode(false)}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isAdminMode 
                    ? 'bg-white dark:bg-slate-900 text-blue-500 dark:text-blue-400 shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                <User className="h-4 w-4" /> Student View
              </button>
              <button
                onClick={() => setIsAdminMode(true)}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdminMode 
                    ? 'bg-white dark:bg-slate-900 text-purple-500 dark:text-purple-400 shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                <Settings className="h-4 w-4" /> Admin View
              </button>
            </div>
          </div>

          {/* Alert Popups */}
          <AnimatePresence>
            {adminNotification && (
              <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-850/50 font-medium text-sm flex items-center gap-3"
              >
                <Check className="h-5 w-5 bg-emerald-500 text-white rounded-full p-0.5" />
                {adminNotification}
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN DASHBOARD CORE VIEW */}
          {!isAdminMode ? (
            /* STUDENT VIEW LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Student Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Check In Action Widget */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
                    <ScanFace className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                      Smart Check-In
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Initialize coordinates verification and facial biometric matching to log attendance.
                    </p>
                  </div>
                  <button
                    onClick={startSimulation}
                    className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] transition-all text-white flex items-center justify-center gap-2 group"
                  >
                    Open Scanner <Camera className="h-4.5 w-4.5 group-hover:scale-105 transition-transform" />
                  </button>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-850 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    CAMPUS GEOFENCE BOUNDS: <span className="text-emerald-500 font-bold">INSIDE</span>
                  </div>
                </div>

                {/* Overall Attendance gauge widget */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col items-center">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 self-start">
                    Overall Attendance
                  </h3>
                  
                  {/* Gauge */}
                  <div className="h-[180px] w-full relative flex items-center justify-center">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          barSize={12}
                          data={[{ name: 'Attendance', value: 88, fill: 'url(#gradient-cyan-blue)' }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <defs>
                            <linearGradient id="gradient-cyan-blue" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                          <RadialBar dataKey="value" cornerRadius={6} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-slate-400">Loading gauge...</div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-black text-slate-800 dark:text-slate-100">88%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Good Standing</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center leading-relaxed mt-2">
                    Min limit is 75%. You need 3 more lectures present to cross 90%.
                  </p>
                </div>
              </div>

              {/* Right Student Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Subject Attendance Grid */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-6">
                    Subject Wise attendance
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjectData.map((sub) => (
                      <div 
                        key={sub.name} 
                        className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 space-y-3 relative overflow-hidden group"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{sub.name}</span>
                          <span className={`font-black ${sub.attendance < 75 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
                            {sub.attendance}%
                          </span>
                        </div>
                        {/* Custom Bar */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${sub.attendance}%`,
                              backgroundColor: sub.fill
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                          <span>Required: 75%</span>
                          {sub.attendance < 75 ? (
                            <span className="text-red-500 font-bold flex items-center gap-0.5">
                              <AlertTriangle className="h-3 w-3" /> Defaulter Threshold
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                              <CheckCircle className="h-3 w-3" /> Safe
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Log list table */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                      Recent Attendance Logs
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      Showing last 5 logs
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-3">
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Subject</th>
                          <th className="pb-3">Timestamp</th>
                          <th className="pb-3">Method</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">{log.date}</td>
                            <td className="py-3.5 text-slate-500 dark:text-slate-400">{log.subject}</td>
                            <td className="py-3.5 text-slate-500 dark:text-slate-400 font-mono">{log.time}</td>
                            <td className="py-3.5 font-medium text-slate-400">{log.verified}</td>
                            <td className="py-3.5 text-right">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                log.status === 'Present' 
                                  ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400' 
                                  : 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ADMIN VIEW LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Top Row Stats counters */}
              <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Verified Present', val: '142 / 150', icon: <Users className="h-5 w-5 text-blue-500" />, sub: '94.6% present rate' },
                  { label: 'Defaulters Alert', val: '8 Students', icon: <ShieldAlert className="h-5 w-5 text-red-500" />, sub: 'Attendance < 75%' },
                  { label: 'Active Lectures', val: '3 Courses', icon: <BookOpen className="h-5 w-5 text-purple-500" />, sub: 'Monitoring coordinates' },
                  { label: 'Geofence Perimeter', val: '50 Meters', icon: <MapPin className="h-5 w-5 text-pink-500" />, sub: 'Active campus locking' },
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 dark:bg-slate-800/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-850 shadow-sm">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{item.val}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left Admin Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Trend lines chart */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between">
                    Weekly Attendance Trends
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-lg">
                      Class: CSE-A
                    </span>
                  </h3>

                  <div className="h-[240px] w-full text-xs">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                          <XAxis dataKey="day" stroke="currentColor" className="text-slate-400 dark:text-slate-500" />
                          <YAxis unit="%" domain={[80, 100]} stroke="currentColor" className="text-slate-400 dark:text-slate-500" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--bg-secondary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-primary)',
                              borderRadius: '12px'
                            }}
                          />
                          <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-slate-400">Loading chart...</div>
                    )}
                  </div>
                </div>

                {/* Defaulter tracking Table */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                        Attendance Defaulter Alerts
                      </h3>
                      <p className="text-xs text-slate-400">Attendance status below critical limit (75%).</p>
                    </div>
                    <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 px-2 py-0.5 rounded-full uppercase">
                      Requires Action
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-3">
                          <th className="pb-3">Student</th>
                          <th className="pb-3">Subject</th>
                          <th className="pb-3">Attendance</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaulters.map((item) => (
                          <tr key={item.roll} className="border-b border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5">
                              <p className="font-bold text-slate-700 dark:text-slate-200">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{item.roll}</p>
                            </td>
                            <td className="py-3.5 text-slate-500 dark:text-slate-400">{item.subject}</td>
                            <td className="py-3.5 font-bold text-red-500">{item.attendance}</td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => handleSendWarning(item.name)}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-900/50 hover:border-transparent transition-all"
                              >
                                Send Warning
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Admin Column */}
              <div className="lg:col-span-5 space-y-6">
                {/* Geofence circular radar simulator */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                      Geofence Node Map
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Map
                    </span>
                  </div>

                  {/* Circle Map */}
                  <div className="relative w-full aspect-square max-w-[280px] bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl flex items-center justify-center overflow-hidden">
                    {/* SVG map nodes */}
                    <svg className="w-full h-full" viewBox="0 0 300 300">
                      {/* Grid overlays */}
                      <circle cx="150" cy="150" r="120" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                      <circle cx="150" cy="150" r="80" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" fill="none" />
                      
                      {/* Campus locking area */}
                      <circle cx="150" cy="150" r="80" fill="rgba(59, 130, 246, 0.03)" />
                      
                      {/* Radar lines sweeping */}
                      <circle cx="150" cy="150" r="40" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" fill="none" />
                      <line x1="150" y1="150" x2="230" y2="150" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1.5" className="origin-[150px_150px] animate-[spin_5s_linear_infinite]" />

                      {/* Classroom Center Pin */}
                      <circle cx="150" cy="150" r="4" className="fill-blue-500" />
                      
                      {/* Verified Students Nodes */}
                      {mapStudents.map((node) => (
                        <g key={node.id} className="cursor-pointer group">
                          {/* Pulse ring for outer nodes */}
                          {node.status === 'outside' ? (
                            <circle cx={node.cx} cy={node.cy} r="6" className="fill-red-500/20 stroke-red-500/50 stroke-1 animate-ping" />
                          ) : (
                            <circle cx={node.cx} cy={node.cy} r="6" className="fill-emerald-500/20 stroke-emerald-500/50 stroke-1" />
                          )}
                          <circle 
                            cx={node.cx} 
                            cy={node.cy} 
                            r="4.5" 
                            className={`${node.status === 'inside' ? 'fill-emerald-500' : 'fill-red-500'} group-hover:scale-125 transition-transform duration-200`} 
                          />
                          <title>{`${node.name} (${node.dist} - ${node.status.toUpperCase()})`}</title>
                        </g>
                      ))}
                    </svg>

                    {/* Coordinates Overlay HUD */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] font-mono text-slate-400 bg-white/60 dark:bg-slate-900/60 p-1.5 rounded-lg">
                      <span>CENTER: 23.2599° N, 77.4126° E</span>
                      <span>RADIUS: 50m</span>
                    </div>
                  </div>

                  {/* Summary lists */}
                  <div className="w-full mt-4 grid grid-cols-2 gap-4 text-xs font-mono border-t border-slate-100 dark:border-slate-850 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-500 dark:text-slate-400">Inside Geofence ({mapStudents.filter(s => s.status === 'inside').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-slate-500 dark:text-slate-400">Outside Area ({mapStudents.filter(s => s.status === 'outside').length})</span>
                    </div>
                  </div>
                </div>

                {/* Real-time logging feed */}
                <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
                    Live Check-In Logs Stream
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </h3>
                  
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {liveFeed.map((item, idx) => (
                        <motion.div 
                          key={item + idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850/80 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                          {item}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DETAILED STUDENT CAMERA SCANNED MODAL SIMULATION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-[420px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative z-10 overflow-hidden flex flex-col items-center justify-center"
            >
              {/* Corner overlays for scanner design */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Title Header */}
              <div className="w-full text-center space-y-1 mb-6">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                  Biometric Scan Simulator
                </h3>
                <p className="text-xs text-slate-400">Secure GPS + Computer Vision matching</p>
              </div>

              {/* Scanner Screen Visual */}
              <div className="w-full aspect-square max-w-[280px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850/80 relative overflow-hidden flex flex-col items-center justify-center">
                {/* Mesh dots overlay */}
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

                {/* Animated scanline */}
                {simStep === 2 && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline z-30 shadow-[0_0_8px_#22d3ee]" />
                )}

                {/* Step states UI representation */}
                <AnimatePresence mode="wait">
                  {simStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center p-4 space-y-4 flex flex-col items-center"
                    >
                      <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Initializing Biometrics...</p>
                    </motion.div>
                  )}

                  {simStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center p-4 space-y-4 flex flex-col items-center"
                    >
                      <MapPin className="h-10 w-10 text-purple-500 animate-bounce" />
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Checking Geofence Bounds...</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">Lat: 23.2599 | Lon: 77.4126 (OK)</p>
                      </div>
                    </motion.div>
                  )}

                  {simStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-20 w-40 h-40 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center overflow-hidden"
                    >
                      <ScanFace className="w-16 h-16 text-blue-500/40 animate-pulse" />
                      <svg className="absolute inset-0 w-full h-full text-cyan-400" viewBox="0 0 100 100">
                        <circle cx="50" cy="35" r="1" className="fill-current animate-ping" />
                        <circle cx="40" cy="45" r="0.75" className="fill-current" />
                        <circle cx="60" cy="45" r="0.75" className="fill-current" />
                        <circle cx="50" cy="55" r="1" className="fill-current" />
                        <line x1="50" y1="35" x2="40" y2="45" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                        <line x1="50" y1="35" x2="60" y2="45" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                        <line x1="40" y1="45" x2="50" y2="55" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                        <line x1="60" y1="45" x2="50" y2="55" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                      </svg>
                      <p className="absolute bottom-2 text-[8px] font-mono text-cyan-400 tracking-wider">MAPPING FACELANDMARKS</p>
                    </motion.div>
                  )}

                  {simStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center p-4 space-y-4 flex flex-col items-center"
                    >
                      <ShieldCheck className="h-10 w-10 text-emerald-500 animate-pulse" />
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Verifying Liveness...</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">BLINK DETECTED</p>
                      </div>
                    </motion.div>
                  )}

                  {simStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center p-4 space-y-4 flex flex-col items-center"
                    >
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-10 w-10 animate-bounce" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Attendance Marked!</p>
                        <p className="text-[10px] text-slate-400 mt-1">Logged to secure cloud logs.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status footer inside scanner modal */}
              <div className="w-full mt-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-850/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">PROGRESS STATUS</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold uppercase">
                  {simStep === 0 && 'BOOTING'}
                  {simStep === 1 && 'GPS LOCKED'}
                  {simStep === 2 && 'MAPPING BIOMETRICS'}
                  {simStep === 3 && 'LIVENESS ANALYSIS'}
                  {simStep === 4 && 'SUCCESS!'}
                </span>
              </div>

              {/* Close Button */}
              {simStep === 4 && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-4 py-3 rounded-2xl font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}
