"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const classroom_1 = __importDefault(require("./routes/classroom"));
const lecture_1 = __importDefault(require("./routes/lecture"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const app = (0, express_1.default)();
// Global Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Log requests during development
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
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
app.use('/api/auth', auth_1.default);
app.use('/api/classrooms', classroom_1.default);
app.use('/api/lectures', lecture_1.default);
app.use('/api/attendance', attendance_1.default);
exports.default = app;
