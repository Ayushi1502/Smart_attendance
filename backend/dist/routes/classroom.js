"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Classroom_1 = require("../models/Classroom");
const auth_1 = require("../middleware/auth");
const db_1 = require("../config/db");
const router = express_1.default.Router();
/**
 * @route   POST /api/classrooms
 * @desc    Create a new classroom geofence config (Admin only)
 */
router.post('/', auth_1.protect, (0, auth_1.authorize)('admin'), async (req, res) => {
    try {
        const { name, latitude, longitude, radius } = req.body;
        if (!name || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: 'Classroom config requires a name, latitude, and longitude.' });
        }
        if (db_1.isMemoryDbActive) {
            const newClass = {
                id: Math.random().toString(36).substr(2, 9),
                name,
                latitude: Number(latitude),
                longitude: Number(longitude),
                radius: radius ? Number(radius) : 50,
                createdAt: new Date()
            };
            db_1.memoryStore.classrooms.push(newClass);
            return res.status(201).json({ success: true, classroom: newClass });
        }
        const newClass = await Classroom_1.Classroom.create({
            name,
            latitude,
            longitude,
            radius: radius || 50
        });
        return res.status(201).json({ success: true, classroom: newClass });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/classrooms
 * @desc    Get all classrooms
 */
router.get('/', auth_1.protect, async (req, res) => {
    try {
        if (db_1.isMemoryDbActive) {
            return res.json({ success: true, classrooms: db_1.memoryStore.classrooms });
        }
        const classrooms = await Classroom_1.Classroom.find();
        return res.json({ success: true, classrooms });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/classrooms/:id
 * @desc    Get specific classroom by ID
 */
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const classId = req.params.id;
        if (db_1.isMemoryDbActive) {
            const cls = db_1.memoryStore.classrooms.find(c => c.id === classId);
            if (!cls) {
                return res.status(404).json({ success: false, message: 'Classroom not found.' });
            }
            return res.json({ success: true, classroom: cls });
        }
        const cls = await Classroom_1.Classroom.findById(classId);
        if (!cls) {
            return res.status(404).json({ success: false, message: 'Classroom not found.' });
        }
        return res.json({ success: true, classroom: cls });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
