"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Initialize Server Lifecycle
async function startServer() {
    // 1. Establish database connection (or trigger in-memory fallback)
    await (0, db_1.connectDB)();
    // 2. Start listening on the specified port
    app_1.default.listen(PORT, () => {
        console.log(`\n>>> SmartAttendance Backend Server running on port ${PORT}`);
        console.log(`>>> Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log(`>>> Health check: http://localhost:${PORT}/api/health\n`);
    });
}
startServer();
