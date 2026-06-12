import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import classroomRoutes from './routes/classroom';
import lectureRoutes from './routes/lecture';
import attendanceRoutes from './routes/attendance';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Log requests during development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'Smart Attendance System API is running successfully.',
    timestamp: new Date()
  });
});

// Route bindings
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);

export default app;
