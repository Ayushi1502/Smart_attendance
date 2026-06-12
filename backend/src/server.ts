import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Server Lifecycle
async function startServer() {
  // 1. Establish database connection (or trigger in-memory fallback)
  await connectDB();

  // 2. Start listening on the specified port
  app.listen(PORT, () => {
    console.log(`\n>>> SmartAttendance Backend Server running on port ${PORT}`);
    console.log(`>>> Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`>>> Health check: http://localhost:${PORT}/api/health\n`);
  });
}

startServer();
