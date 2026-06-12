"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = exports.isMemoryDbActive = void 0;
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
exports.isMemoryDbActive = false;
// Voluntary in-memory datastore fallback
exports.memoryStore = {
    users: [],
    classrooms: [],
    lectures: [],
    attendance: []
};
async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_attendance';
        console.log(`Connecting to MongoDB at: ${mongoUri}...`);
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500 // 2.5 second connection timeout
        });
        console.log('Database connected: MongoDB instance resolved.');
    }
    catch (error) {
        console.log('\n==================================================');
        console.log('  [WARNING] MONGODB CONNECTION FAILED!');
        console.log(`  Reason: ${error.message}`);
        console.log('  [ACTION] IN-MEMORY DATABASE FALLBACK ACTIVATED.');
        console.log('  The server will now run seamlessly in memory.');
        console.log('==================================================\n');
        exports.isMemoryDbActive = true;
    }
}
