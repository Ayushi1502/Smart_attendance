"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sih_hackaholics_smart_attend_secret_2026';
// Helper to sign JWT tokens
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};
/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const userRole = role === 'admin' ? 'admin' : 'student';
        if (db_1.isMemoryDbActive) {
            // Memory DB logic
            const exists = db_1.memoryStore.users.find(u => u.email === email);
            if (exists) {
                return res.status(400).json({ success: false, message: 'User already exists.' });
            }
            const newUser = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                passwordHash,
                role: userRole,
                createdAt: new Date()
            };
            db_1.memoryStore.users.push(newUser);
            const token = generateToken(newUser.id, newUser.role);
            return res.status(201).json({
                success: true,
                token,
                user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
            });
        }
        // MongoDB Mongoose logic
        const exists = await User_1.User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }
        const newUser = await User_1.User.create({
            name,
            email,
            passwordHash,
            role: userRole
        });
        const token = generateToken(newUser._id.toString(), newUser.role);
        return res.status(201).json({
            success: true,
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate credentials
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }
        if (db_1.isMemoryDbActive) {
            const user = db_1.memoryStore.users.find(u => u.email === email);
            if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
                return res.status(400).json({ success: false, message: 'Invalid credentials.' });
            }
            const token = generateToken(user.id, user.role);
            return res.json({
                success: true,
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role, faceEmbedding: user.faceEmbedding }
            });
        }
        const user = await User_1.User.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.passwordHash))) {
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }
        const token = generateToken(user._id.toString(), user.role);
        return res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, faceEmbedding: user.faceEmbedding }
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   POST /api/auth/face-register
 * @desc    Upload facial biometric landmarks embeddings vector
 */
router.post('/face-register', auth_1.protect, async (req, res) => {
    try {
        const { faceEmbedding } = req.body;
        if (!faceEmbedding || !Array.isArray(faceEmbedding) || faceEmbedding.length !== 128) {
            return res.status(400).json({ success: false, message: 'Biometric registration requires a valid 128-dimensional embedding vector.' });
        }
        const userId = req.user?.id;
        if (db_1.isMemoryDbActive) {
            const idx = db_1.memoryStore.users.findIndex(u => u.id === userId);
            if (idx === -1) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            db_1.memoryStore.users[idx].faceEmbedding = faceEmbedding;
            return res.json({ success: true, message: 'Facial landmarks vector successfully registered.' });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        user.faceEmbedding = faceEmbedding;
        await user.save();
        return res.json({ success: true, message: 'Facial landmarks vector successfully registered.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 */
router.get('/profile', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (db_1.isMemoryDbActive) {
            const user = db_1.memoryStore.users.find(u => u.id === userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User profile not resolved.' });
            }
            return res.json({
                success: true,
                user: { id: user.id, name: user.name, email: user.email, role: user.role, faceEmbedding: user.faceEmbedding }
            });
        }
        const user = await User_1.User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User profile not resolved.' });
        }
        return res.json({ success: true, user });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
