const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to handle fetch requests with auth token
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth endpoints
  signup: (body: { name: string; email: string; password?: string; role: string }) => 
    fetchWithAuth('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    
  login: (body: { email: string; password?: string }) => 
    fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    
  registerFace: (faceEmbedding: number[]) => 
    fetchWithAuth('/auth/face-register', { method: 'POST', body: JSON.stringify({ faceEmbedding }) }),
    
  getProfile: () => 
    fetchWithAuth('/auth/profile'),

  // Classrooms
  createClassroom: (body: { name: string; latitude: number; longitude: number; radius?: number }) => 
    fetchWithAuth('/classrooms', { method: 'POST', body: JSON.stringify(body) }),
    
  getClassrooms: () => 
    fetchWithAuth('/classrooms'),

  // Lectures
  createLecture: (body: { classroomId: string; subjectName: string; startTime: string; endTime: string }) => 
    fetchWithAuth('/lectures', { method: 'POST', body: JSON.stringify(body) }),
    
  getActiveLectures: () => 
    fetchWithAuth('/lectures/active'),
    
  getLectures: () => 
    fetchWithAuth('/lectures'),

  // Attendance
  checkIn: (body: { 
    lectureId: string; 
    latitude: number; 
    longitude: number; 
    faceEmbedding: number[]; 
    livenessVerified: boolean;
    qrCode?: string;
  }) => 
    fetchWithAuth('/attendance/check-in', { method: 'POST', body: JSON.stringify(body) }),
    
  getReports: (lectureId: string) => 
    fetchWithAuth(`/attendance/reports/${lectureId}`),
    
  getStudentLogs: () => 
    fetchWithAuth('/attendance/student-logs'),
    
  getDefaulters: () => 
    fetchWithAuth('/attendance/defaulters'),
};
