import mongoose from 'mongoose';

export let isMemoryDbActive = false;

// Voluntary in-memory datastore fallback
export const memoryStore: {
  users: any[];
  classrooms: any[];
  lectures: any[];
  attendance: any[];
} = {
  users: [],
  classrooms: [],
  lectures: [],
  attendance: []
};

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_attendance';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500 // 2.5 second connection timeout
    });
    console.log('Database connected: MongoDB instance resolved.');
  } catch (error: any) {
    console.log('\n==================================================');
    console.log('  [WARNING] MONGODB CONNECTION FAILED!');
    console.log(`  Reason: ${error.message}`);
    console.log('  [ACTION] IN-MEMORY DATABASE FALLBACK ACTIVATED.');
    console.log('  The server will now run seamlessly in memory.');
    console.log('==================================================\n');
    isMemoryDbActive = true;
  }
}
