'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanFace, MapPin, CheckCircle, AlertTriangle, Users, BookOpen, 
  Map, Bell, FileSpreadsheet, RefreshCw, User, Camera, ShieldCheck, 
  Search, ShieldAlert, Check, Play, Settings, Key, Mail, Landmark,
  Plus, LogOut, ArrowRight, ShieldCheck as VerifiedIcon, ShieldX
} from 'lucide-react';
import { 
  ResponsiveContainer, RadialBarChart, RadialBar, 
  XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid 
} from 'recharts';
import { api } from '@/utils/api';

// Mock Data for Fallback/Offline Mode
const mockSubjects = [
  { name: 'Mathematics', attendance: 92, fill: '#3b82f6' },
  { name: 'Computer Science', attendance: 95, fill: '#8b5cf6' },
  { name: 'Physics', attendance: 72, fill: '#ef4444' },
  { name: 'Chemistry', attendance: 85, fill: '#f59e0b' },
];

const mockLogs = [
  { id: '1', date: '2026-06-12', time: '09:02 AM', subject: 'Computer Science', status: 'Present', verified: 'Face + GPS' },
  { id: '2', date: '2026-06-11', time: '10:15 AM', subject: 'Mathematics', status: 'Present', verified: 'Face + GPS' },
  { id: '3', date: '2026-06-10', time: '11:30 AM', subject: 'Physics', status: 'Absent', verified: 'None' },
  { id: '4', date: '2026-06-09', time: '09:05 AM', subject: 'Chemistry', status: 'Present', verified: 'Face + GPS' },
];

const mockTrends = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 96 },
  { day: 'Wed', rate: 91 },
  { day: 'Thu', rate: 93 },
  { day: 'Fri', rate: 95 },
];

const mockDefaulters = [
  { roll: 'CSE-2026-004', name: 'Raj Patel', attendance: '68%', subject: 'Physics', status: 'Flagged' },
  { roll: 'CSE-2026-018', name: 'Sneha Rao', attendance: '71%', subject: 'Mathematics', status: 'Flagged' },
  { roll: 'CSE-2026-033', name: 'Amit Verma', attendance: '65%', subject: 'Physics', status: 'Flagged' },
];

const mockMapNodes = [
  { id: 1, name: 'Ayushi Awasthi (You)', dist: '4m', status: 'inside', cx: 150, cy: 150 },
  { id: 2, name: 'Priya Sharma', dist: '12m', status: 'inside', cx: 120, cy: 190 },
  { id: 3, name: 'Rohan Gupta', dist: '24m', status: 'inside', cx: 210, cy: 110 },
  { id: 4, name: 'Raj Patel', dist: '62m', status: 'outside', cx: 40, cy: 60 },
];

export default function DemoPage() {
  const [mounted, setMounted] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [checkConnectionLoading, setCheckConnectionLoading] = useState(true);
  
  // Auth States
  const [user, setUser] = useState<any>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Client state
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Data lists (Populated via API or mocks)
  const [activeLectures, setActiveLectures] = useState<any[]>([]);
  const [studentLogs, setStudentLogs] = useState<any[]>(mockLogs);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [defaulters, setDefaulters] = useState<any[]>(mockDefaulters);
  const [liveFeed, setLiveFeed] = useState<string[]>([
    '02:15 PM - Priya Sharma checked in (CS Lecture Hall)',
    '02:12 PM - Rohan Gupta checked in (CS Lecture Hall)',
  ]);
  
  // Geofence Radar mock nodes
  const [mapNodes, setMapNodes] = useState(mockMapNodes);

  // Admin Config forms
  const [classroomForm, setClassroomForm] = useState({ name: '', latitude: '', longitude: '', radius: '50' });
  const [lectureForm, setLectureForm] = useState({ classroomId: '', subjectName: '', startTime: '', endTime: '' });
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Student Biometric Scan Simulator state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: Start, 1: GPS Verify, 2: Face Scan, 3: Liveness, 4: Success
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 23.2599, lon: 77.4126, label: 'Default Mock Coordinates' });
  const [scanLectureId, setScanLectureId] = useState('');
  const [scanResultError, setScanResultError] = useState('');

  // 1. Initial health checks & profile loadings
  useEffect(() => {
    setMounted(true);
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setCheckConnectionLoading(true);
      // Retrieve stored token
      const token = localStorage.getItem('token');
      
      // Test health endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const healthRes = await fetch(`${API_URL}/health`).catch(() => null);
      
      if (healthRes && healthRes.ok) {
        setIsApiConnected(true);
        if (token) {
          try {
            const profileData = await api.getProfile();
            setUser(profileData.user);
            setIsAdminMode(profileData.user.role === 'admin');
          } catch (e) {
            localStorage.removeItem('token');
          }
        }
      } else {
        setIsApiConnected(false);
      }
    } catch (err) {
      setIsApiConnected(false);
    } finally {
      setCheckConnectionLoading(false);
    }
  };

  // 2. Fetch Dashboard Data depending on connection state
  useEffect(() => {
    if (isApiConnected && user) {
      loadDashboardData();
    }
  }, [isApiConnected, user]);

  const loadDashboardData = async () => {
    try {
      if (user.role === 'student') {
        // Fetch student logs
        const logsData = await api.getStudentLogs().catch(() => null);
        if (logsData && logsData.success) {
          const formatted = logsData.logs.map((l: any) => ({
            id: l.id || l._id,
            date: new Date(l.timestamp).toLocaleDateString(),
            time: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            subject: l.lectureId?.subjectName || 'Lecture Session',
            status: l.status,
            verified: l.verificationMethods.join(' + ')
          }));
          setStudentLogs(formatted);
        }
        
        // Fetch active lectures for check-in
        const activeData = await api.getActiveLectures().catch(() => null);
        if (activeData && activeData.success) {
          setActiveLectures(activeData.lectures);
        }
      } else {
        // Fetch admin defaulters
        const defData = await api.getDefaulters().catch(() => null);
        if (defData && defData.success) {
          const formatted = defData.defaulters.map((d: any) => ({
            roll: d.student?.email || 'N/A',
            name: d.student?.name || 'Student',
            attendance: `${d.rate}%`,
            subject: 'Overall Limit',
            status: d.rate < 75 ? 'Flagged' : 'Safe'
          }));
          setDefaulters(formatted);
        }

        // Fetch classrooms list
        const classData = await api.getClassrooms().catch(() => null);
        if (classData && classData.success) {
          setClassrooms(classData.classrooms);
        }
      }
    } catch (e) {
      console.error('Error loading dashboard data', e);
    }
  };

  // 3. User Login/Signup handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isApiConnected) {
        const res = await api.login(loginForm);
        localStorage.setItem('token', res.token);
        setUser(res.user);
        setIsAdminMode(res.user.role === 'admin');
      } else {
        // Mock Login for presentation
        const mockUser = {
          id: 'mock-student-id',
          name: loginForm.email.split('@')[0].toUpperCase(),
          email: loginForm.email,
          role: loginForm.email.includes('admin') ? 'admin' : 'student',
          faceEmbedding: Array(128).fill(0.1)
        };
        setUser(mockUser);
        setIsAdminMode(mockUser.role === 'admin');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isApiConnected) {
        const res = await api.signup(signupForm);
        localStorage.setItem('token', res.token);
        setUser(res.user);
        setIsAdminMode(res.user.role === 'admin');
      } else {
        // Mock Signup
        const mockUser = {
          id: 'mock-user-id',
          name: signupForm.name,
          email: signupForm.email,
          role: signupForm.role,
        };
        setUser(mockUser);
        setIsAdminMode(mockUser.role === 'admin');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoginForm({ email: '', password: '' });
    setSignupForm({ name: '', email: '', password: '', role: 'student' });
  };

  // 4. Biometric Face Vectors Registration
  const handleRegisterBiometrics = async () => {
    try {
      setAuthLoading(true);
      const dummyEmbedding = Array.from({ length: 128 }, () => Math.random());
      
      if (isApiConnected) {
        await api.registerFace(dummyEmbedding);
        const updatedProfile = await api.getProfile();
        setUser(updatedProfile.user);
      } else {
        setUser((prev: any) => ({ ...prev, faceEmbedding: dummyEmbedding }));
      }
      alert('Biometric facial embedding generated and registered successfully!');
    } catch (err: any) {
      alert(err.message || 'Biometrics upload failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 5. Geofence & Check-In Simulation Trigger
  const handleOpenScanner = (lectureId: string) => {
    setScanLectureId(lectureId);
    setScanResultError('');
    setSimStep(0);
    setIsModalOpen(true);

    // Geolocation Query
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lon: Number(pos.coords.longitude.toFixed(6)),
            label: 'Live Device GPS coordinates'
          });
        },
        () => {
          // Fallback to coordinates center
          setGpsCoordinates({ lat: 23.2599, lon: 77.4126, label: 'Mock Lecture Perimeter Center' });
        }
      );
    }

    // Step-by-Step Sim loop
    setTimeout(() => {
      setSimStep(1); // GPS Lock
      setTimeout(() => {
        setSimStep(2); // Face scanning
        setTimeout(() => {
          setSimStep(3); // Liveness check
          setTimeout(async () => {
            // Check-in post execution
            try {
              if (isApiConnected) {
                const dummyEmbedding = user.faceEmbedding || Array(128).fill(0.1);
                
                await api.checkIn({
                  lectureId,
                  latitude: gpsCoordinates.lat,
                  longitude: gpsCoordinates.lon,
                  faceEmbedding: dummyEmbedding,
                  livenessVerified: true
                });
                
                setSimStep(4); // Success state
                loadDashboardData();
              } else {
                // Mock local check-in
                setSimStep(4);
                const today = new Date().toISOString().split('T')[0];
                const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setStudentLogs((prev) => [
                  {
                    id: Math.random().toString(),
                    date: today,
                    time: nowStr,
                    subject: 'Computer Science (Mock)',
                    status: 'Present',
                    verified: 'Face + GPS'
                  },
                  ...prev
                ]);
              }
            } catch (err: any) {
              setSimStep(2);
              setScanResultError(err.message || 'Location boundary check or face biometric match failed.');
            }
          }, 1800);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  // 6. Admin configs postings
  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg('');
    try {
      const body = {
        name: classroomForm.name,
        latitude: Number(classroomForm.latitude),
        longitude: Number(classroomForm.longitude),
        radius: Number(classroomForm.radius)
      };

      if (isApiConnected) {
        await api.createClassroom(body);
        loadDashboardData();
      } else {
        setClassrooms((prev) => [...prev, { ...body, id: Math.random().toString(), createdAt: new Date() }]);
      }
      setAdminSuccessMsg(`Classroom "${classroomForm.name}" geofence boundary defined successfully!`);
      setClassroomForm({ name: '', latitude: '', longitude: '', radius: '50' });
    } catch (err: any) {
      alert(err.message || 'Error creating geofence config.');
    }
  };

  const handleCreateLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminSuccessMsg('');
    try {
      const body = {
        classroomId: lectureForm.classroomId,
        subjectName: lectureForm.subjectName,
        startTime: lectureForm.startTime,
        endTime: lectureForm.endTime
      };

      if (isApiConnected) {
        await api.createLecture(body);
        loadDashboardData();
      } else {
        alert('Lecture session scheduled locally (Mock Mode).');
      }
      setAdminSuccessMsg(`Lecture "${lectureForm.subjectName}" scheduled and active.`);
      setLectureForm({ classroomId: '', subjectName: '', startTime: '', endTime: '' });
    } catch (err: any) {
      alert(err.message || 'Error scheduling lecture.');
    }
  };

  const handleSendWarning = (name: string) => {
    setAdminNotification(`Warning alert & low-attendance notifications dispatched to ${name} & parents!`);
    setTimeout(() => setAdminNotification(null), 4000);
  };

  // Loading Splash screen
  if (!mounted || checkConnectionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 font-sans">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Syncing database connections...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-16 dark:bg-gray-950 dot-grid relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          {/* Header Banner & Connection Status */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/60 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                  Control Panel Environment
                </span>
                {isApiConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30">
                    <VerifiedIcon className="h-3 w-3" /> Live Database Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 border border-amber-200/30">
                    <ShieldX className="h-3 w-3" /> Offline Simulator Mode
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 mt-1">
                {user ? `Welcome, ${user.name}` : 'SmartAttend Portal Hub'}
              </h1>
            </div>

            {/* Logout/Profile Header Controls */}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl border border-slate-200/10 uppercase tracking-wider">
                  ROLE: {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-red-500 hover:text-white transition-all text-slate-500"
                  title="Logout Session"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* AUTHENTICATION ROUTER SHELL */}
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-[480px] mx-auto p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md shadow-xl space-y-6"
              >
                <div className="text-center space-y-1.5">
                  <h2 className="text-2xl font-black tracking-tight text-slate-850 dark:text-slate-50">
                    {showSignup ? 'Create Account' : 'Security Sign-In'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {showSignup ? 'Register your biometric credentials.' : 'Verify credentials to access geofences.'}
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-950/20 text-red-800 dark:text-red-400 border border-red-200/30 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5" /> {authError}
                  </div>
                )}

                {/* Main Auth Forms */}
                {!showSignup ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email Address</label>
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="you@domain.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Key className="h-3.5 w-3.5" /> Password</label>
                      <input
                        type="password"
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      {authLoading ? 'Signing In...' : 'Verify & Enter'} <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="text-center pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowSignup(true)}
                        className="text-blue-500 dark:text-blue-400 font-bold hover:underline"
                      >
                        {"Don't have an account? Sign Up"}
                      </button>
                    </div>
                    
                    {/* Demo shortcut helpers */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setLoginForm({ email: 'student@example.com', password: 'password123' });
                            setSignupForm({ name: 'Demo Student', email: 'student@example.com', password: 'password123', role: 'student' });
                          }}
                          className="py-2 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500"
                        >
                          Autofill Student (Demo)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLoginForm({ email: 'admin@example.com', password: 'password123' });
                            setSignupForm({ name: 'Demo Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
                          }}
                          className="py-2 rounded-xl text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500"
                        >
                          Autofill Admin (Demo)
                        </button>
                      </div>
                      {isApiConnected && (
                        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 leading-normal">
                          ℹ️ Live DB is connected. If logging in for the first time, click <strong>Sign Up</strong> above to register.
                        </p>
                      )}
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        required
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="Ayushi Awasthi"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email Address</label>
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="you@domain.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5"><Key className="h-3.5 w-3.5" /> Password</label>
                      <input
                        type="password"
                        required
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Role Account Type</label>
                      <select
                        value={signupForm.role}
                        onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Administrator (Lecturer)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      {authLoading ? 'Registering...' : 'Register User'} <Check className="h-4.5 w-4.5" />
                    </button>

                    <div className="text-center pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowSignup(false)}
                        className="text-blue-500 dark:text-blue-400 font-bold hover:underline"
                      >
                        Already have an account? Sign In
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            ) : (
              /* LOGGED IN ACTIVE DASHBOARD views */
              <motion.div
                key="dashboard-core"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {!isAdminMode ? (
                  /* ---------------- STUDENT PORTAL DASHBOARD ---------------- */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Student Panel */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Biometric Scan trigger widget */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md space-y-5 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
                          <ScanFace className="h-8 w-8 animate-pulse-slow" />
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                            Smart Verification
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {user.faceEmbedding 
                              ? 'Biometric features registered. Click below to verify GPS and check-in.' 
                              : 'Facial landmarks missing. Please register your biometrics first.'}
                          </p>
                        </div>

                        {user.faceEmbedding ? (
                          <div className="space-y-3">
                            {/* Active lectures listing for check in */}
                            {activeLectures.length > 0 ? (
                              activeLectures.map((lec) => (
                                <button
                                  key={lec.id || lec._id}
                                  onClick={() => handleOpenScanner(lec.id || lec._id)}
                                  className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                                >
                                  Check In: {lec.subjectName} <Camera className="h-4.5 w-4.5" />
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={() => handleOpenScanner('mock-class-id')}
                                className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                              >
                                Test Check-In Simulator <Camera className="h-4.5 w-4.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleRegisterBiometrics}
                            className="w-full py-3.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            Register Facial Biometrics <ScanFace className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>

                      {/* Subject Attendance Radial Gauge */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col items-center">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 self-start">
                          Overall Performance
                        </h3>
                        
                        <div className="h-[180px] w-full relative flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              cx="50%"
                              cy="50%"
                              innerRadius="70%"
                              outerRadius="100%"
                              barSize={12}
                              data={[{ name: 'Attendance', value: 88, fill: 'url(#gradient-cyan-blue-demo)' }]}
                              startAngle={90}
                              endAngle={-270}
                            >
                              <defs>
                                <linearGradient id="gradient-cyan-blue-demo" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                              </defs>
                              <RadialBar dataKey="value" cornerRadius={6} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">88%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Clear Stand</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Student Panel */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Subject bars listing */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-6">
                          Subject Wise Attendance Limits
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {mockSubjects.map((sub) => (
                            <div 
                              key={sub.name} 
                              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 space-y-3"
                            >
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-700 dark:text-slate-200">{sub.name}</span>
                                <span className={`font-black ${sub.attendance < 75 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
                                  {sub.attendance}%
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ width: `${sub.attendance}%`, backgroundColor: sub.fill }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Student Log List */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-6">
                          Verify History Records
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-3">
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Subject</th>
                                <th className="pb-3">Time</th>
                                <th className="pb-3">Method</th>
                                <th className="pb-3 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentLogs.map((log) => (
                                <tr key={log.id} className="border-b border-slate-100/50 dark:border-slate-850/50">
                                  <td className="py-3.5 font-bold">{log.date}</td>
                                  <td className="py-3.5 text-slate-500">{log.subject}</td>
                                  <td className="py-3.5 font-mono text-slate-400">{log.time}</td>
                                  <td className="py-3.5 text-slate-400">{log.verified}</td>
                                  <td className="py-3.5 text-right">
                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400">
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
                  /* ---------------- ADMINISTRATOR PORTAL DASHBOARD ---------------- */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Top Row counters */}
                    <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Present Today', val: '142 / 150', icon: <Users className="h-5 w-5 text-blue-500" />, sub: '94.6% rate' },
                        { label: 'Defaulters Alert', val: `${defaulters.length} Students`, icon: <ShieldAlert className="h-5 w-5 text-red-500" />, sub: 'Attendance < 75%' },
                        { label: 'Active Classes', val: classrooms.length > 0 ? `${classrooms.length} Rooms` : '3 Rooms', icon: <BookOpen className="h-5 w-5 text-purple-500" />, sub: 'Active boundaries' },
                        { label: 'Radius locking', val: '50 Meters', icon: <MapPin className="h-5 w-5 text-pink-500" />, sub: 'Geofence bounds' },
                      ].map((item) => (
                        <div key={item.label} className="p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/10">
                              {item.icon}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
                          </div>
                          <div>
                            <p className="text-2xl font-black">{item.val}</p>
                            <p className="text-[10px] text-slate-400">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Left Admin column: Config Forms */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Success alerts */}
                      {adminSuccessMsg && (
                        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200/30 font-medium text-xs flex items-center gap-2">
                          <Check className="h-4.5 w-4.5 bg-emerald-500 text-white rounded-full p-0.5" /> {adminSuccessMsg}
                        </div>
                      )}

                      {/* Define Geofence boundary classroom configuration */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md space-y-4">
                        <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                          <Landmark className="h-5 w-5 text-blue-500" /> Define Classroom Geofence
                        </h3>
                        
                        <form onSubmit={handleCreateClassroom} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classroom Name</label>
                            <input
                              type="text"
                              required
                              value={classroomForm.name}
                              onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                              placeholder="CS Lecture Hall A"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Boundary Radius (meters)</label>
                            <input
                              type="number"
                              required
                              value={classroomForm.radius}
                              onChange={(e) => setClassroomForm({ ...classroomForm, radius: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Latitude coordinates</label>
                            <input
                              type="text"
                              required
                              value={classroomForm.latitude}
                              onChange={(e) => setClassroomForm({ ...classroomForm, latitude: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                              placeholder="e.g. 23.259930"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Longitude coordinates</label>
                            <input
                              type="text"
                              required
                              value={classroomForm.longitude}
                              onChange={(e) => setClassroomForm({ ...classroomForm, longitude: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                              placeholder="e.g. 77.412620"
                            />
                          </div>
                          
                          <button
                            type="submit"
                            className="sm:col-span-2 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            Save Boundary Specs <Plus className="h-4 w-4" />
                          </button>
                        </form>
                      </div>

                      {/* Schedule active Lecture sessions */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md space-y-4">
                        <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-purple-500" /> Schedule Active Lecture
                        </h3>

                        <form onSubmit={handleCreateLecture} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Classroom bounds</label>
                            <select
                              required
                              value={lectureForm.classroomId}
                              onChange={(e) => setLectureForm({ ...lectureForm, classroomId: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                            >
                              <option value="">Select Room</option>
                              {classrooms.map((c) => (
                                <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                              ))}
                              {classrooms.length === 0 && (
                                <option value="mock-room-id">CS Lecture Hall A (Mock)</option>
                              )}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Subject Name</label>
                            <input
                              type="text"
                              required
                              value={lectureForm.subjectName}
                              onChange={(e) => setLectureForm({ ...lectureForm, subjectName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Start Time</label>
                            <input
                              type="datetime-local"
                              required
                              value={lectureForm.startTime}
                              onChange={(e) => setLectureForm({ ...lectureForm, startTime: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">End Time</label>
                            <input
                              type="datetime-local"
                              required
                              value={lectureForm.endTime}
                              onChange={(e) => setLectureForm({ ...lectureForm, endTime: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none font-mono"
                            />
                          </div>

                          <button
                            type="submit"
                            className="sm:col-span-2 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white text-xs transition-all flex items-center justify-center gap-1.5"
                          >
                            Schedule Session & QR code <Play className="h-4 w-4" />
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* Right Admin Column */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Geofence circular node map */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-4">
                          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                            Geofence Node Map
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Map
                          </span>
                        </div>

                        <div className="relative w-full aspect-square max-w-[280px] bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/50 rounded-2xl flex items-center justify-center overflow-hidden">
                          <svg className="w-full h-full" viewBox="0 0 300 300">
                            <circle cx="150" cy="150" r="120" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
                            <circle cx="150" cy="150" r="80" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" fill="none" />
                            <circle cx="150" cy="150" r="80" fill="rgba(59, 130, 246, 0.03)" />
                            <circle cx="150" cy="150" r="4" className="fill-blue-500" />
                            
                            {mapNodes.map((node) => (
                              <g key={node.id} className="cursor-pointer group">
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
                                <title>{`${node.name} (${node.dist})`}</title>
                              </g>
                            ))}
                          </svg>
                        </div>
                      </div>

                      {/* Defaulters limit warning list */}
                      <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 backdrop-blur-md">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
                          Defaulters alert list
                        </h3>

                        <div className="space-y-4">
                          {defaulters.map((item) => (
                            <div key={item.roll} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/10">
                              <div>
                                <p className="text-xs font-bold">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{item.roll}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-red-500">{item.attendance}</span>
                                <button
                                  onClick={() => handleSendWarning(item.name)}
                                  className="px-2.5 py-1 rounded-lg text-[9px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Alert
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* VERIFY HUD SCANNING SIMULATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-[420px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl relative z-10 overflow-hidden flex flex-col items-center justify-center"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="w-full text-center space-y-1 mb-6">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">
                  Biometric Scan HUD
                </h3>
                <p className="text-xs text-slate-400">Verifying GPS boundary + Facial embeddings</p>
              </div>

              {/* Scanning Screen Visualizer */}
              <div className="w-full aspect-square max-w-[280px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850/80 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

                {simStep === 2 && !scanResultError && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline z-30 shadow-[0_0_8px_#22d3ee]" />
                )}

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
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Initializing scanner...</p>
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
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Locating Geofence Boundary...</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">Lat: {gpsCoordinates.lat} | Lon: {gpsCoordinates.lon}</p>
                        <p className="text-[9px] text-emerald-500 font-bold mt-0.5 uppercase tracking-wide">({gpsCoordinates.label})</p>
                      </div>
                    </motion.div>
                  )}

                  {simStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center"
                    >
                      {scanResultError ? (
                        <div className="text-center space-y-4 flex flex-col items-center">
                          <AlertTriangle className="h-10 w-10 text-red-500 animate-bounce" />
                          <p className="text-xs font-bold text-red-500 px-4 leading-relaxed">{scanResultError}</p>
                        </div>
                      ) : (
                        <div className="relative z-20 w-40 h-40 rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center justify-center overflow-hidden">
                          <ScanFace className="w-16 h-16 text-blue-500/40 animate-pulse" />
                          <p className="absolute bottom-2 text-[8px] font-mono text-cyan-400 tracking-wider">MAPPING EMBEDDING</p>
                        </div>
                      )}
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
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">LIVENESS MATCHED</p>
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
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-10 w-10 animate-bounce" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Attendance Logged!</p>
                        <p className="text-[10px] text-slate-400 mt-1">Synched to cloud attendance ledger.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status footer inside scanner modal */}
              <div className="w-full mt-6 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-855/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">HUD STATUS</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold uppercase">
                  {simStep === 0 && 'BOOTING'}
                  {simStep === 1 && 'GPS LOCKED'}
                  {simStep === 2 && (scanResultError ? 'MATCH FAILED' : 'MAPPING BIOMETRICS')}
                  {simStep === 3 && 'LIVENESS ANALYSIS'}
                  {simStep === 4 && 'SUCCESS!'}
                </span>
              </div>

              {/* Close Button */}
              {(simStep === 4 || scanResultError) && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-4 py-3 rounded-2xl font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  Return to Portal
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
