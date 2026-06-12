"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Lecture_1 = require("../models/Lecture");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
const router = express_1.default.Router();
/**
 * @route   POST /api/lectures
 * @desc    Schedule a new lecture session (Admin only)
 */
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin'), async (req, res) => {
    try {
        const { classroomId, subjectName, startTime, endTime } = req.body;
        if (!classroomId || !subjectName || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'Required fields: classroomId, subjectName, startTime, endTime.' });
        }
        // Dynamic QR code token generator
        const randomSeed = Math.random().toString(36).substring(2, 8).toUpperCase();
        const qrCode = `QR-SESSION-${subjectName.substring(0, 3).toUpperCase()}-${randomSeed}-${Date.now()}`;
        if (db_1.isMemoryDbActive) {
            // Validate classroom exists in memoryStore
            const cls = db_1.memoryStore.classrooms.find(c => c.id === classroomId);
            if (!cls) {
                return res.status(404).json({ success: false, message: 'Configured classroom reference not found.' });
            }
            const newLecture = {
                id: Math.random().toString(36).substr(2, 9),
                classroomId,
                subjectName,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                qrCode,
                createdAt: new Date()
            };
            db_1.memoryStore.lectures.push(newLecture);
            return res.status(201).json({ success: true, lecture: newLecture });
        }
        // MongoDB Mongoose logic
        const newLecture = await Lecture_1.Lecture.create({
            classroomId,
            subjectName,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            qrCode
        });
        return res.status(201).json({ success: true, lecture: newLecture });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/lectures
 * @desc    Get all lectures
 */
router.get('/', auth_1.protect, async (req, res) => {
    try {
        if (db_1.isMemoryDbActive) {
            return res.json({ success: true, lectures: db_1.memoryStore.lectures });
        }
        const lectures = await Lecture_1.Lecture.find().populate('classroomId', 'name');
        return res.json({ success: true, lectures });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/lectures/active
 * @desc    Get active lectures (current time within session limits)
 */
router.get('/active', auth_1.protect, async (req, res) => {
    try {
        const now = new Date();
        if (db_1.isMemoryDbActive) {
            const active = db_1.memoryStore.lectures.filter(l => new Date(l.startTime) <= now && new Date(l.endTime) >= now);
            // Inject classroom name for demo
            const populated = active.map(l => {
                const cls = db_1.memoryStore.classrooms.find(c => c.id === l.classroomId);
                return { ...l, classroomName: cls ? cls.name : 'Unknown Room' };
            });
            return res.json({ success: true, lectures: populated });
        }
        // Mongoose query
        const active = await Lecture_1.Lecture.find({
            startTime: { $lte: now },
            endTime: { $gte: now }
        }).populate('classroomId', 'name');
        return res.json({ success: true, lectures: active });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
