"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Attendance_1 = require("../models/Attendance");
const Lecture_1 = require("../models/Lecture");
const Classroom_1 = require("../models/Classroom");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const geo_1 = require("../utils/geo");
const face_1 = require("../utils/face");
const db_1 = require("../config/db");
const router = express_1.default.Router();
/**
 * @route   POST /api/attendance/check-in
 * @desc    Verify coordinates and biometrics to mark attendance
 */
router.post('/check-in', auth_1.protect, (0, auth_1.authorize)('student'), async (req, res) => {
    try {
        const studentId = req.user?.id;
        const { lectureId, latitude, longitude, faceEmbedding, livenessVerified, qrCode } = req.body;
        if (!lectureId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: 'Missing check-in parameters: lectureId, latitude, longitude.' });
        }
        let lecture;
        let classroom;
        let student;
        if (db_1.isMemoryDbActive) {
            lecture = db_1.memoryStore.lectures.find(l => l.id === lectureId);
            student = db_1.memoryStore.users.find(u => u.id === studentId);
            if (lecture) {
                classroom = db_1.memoryStore.classrooms.find(c => c.id === lecture.classroomId);
            }
        }
        else {
            lecture = await Lecture_1.Lecture.findById(lectureId);
            student = await User_1.User.findById(studentId);
            if (lecture) {
                classroom = await Classroom_1.Classroom.findById(lecture.classroomId);
            }
        }
        if (!lecture) {
            return res.status(404).json({ success: false, message: 'Lecture session not found.' });
        }
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not resolved.' });
        }
        if (!classroom) {
            return res.status(404).json({ success: false, message: 'Classroom bounds not resolved.' });
        }
        // Check-in verification parameters
        const methods = [];
        let isGpsOk = false;
        let isFaceOk = false;
        // 1. Geofence Location Check
        isGpsOk = (0, geo_1.isWithinGeofence)(latitude, longitude, classroom.latitude, classroom.longitude, classroom.radius);
        if (isGpsOk) {
            methods.push('GPS');
        }
        // 2. Face Biometrics matching & Liveness check
        if (faceEmbedding && Array.isArray(faceEmbedding) && student.faceEmbedding) {
            const match = (0, face_1.verifyFaceEmbeddings)(faceEmbedding, student.faceEmbedding);
            if (match.success && livenessVerified === true) {
                isFaceOk = true;
                methods.push('Face');
            }
        }
        // 3. Fallback check: Dynamic QR Code
        const isQrOk = qrCode && qrCode === lecture.qrCode;
        if (isQrOk) {
            methods.push('QR');
        }
        // Determine final status
        const verified = (isGpsOk && isFaceOk) || isQrOk;
        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Verification failed.',
                details: {
                    geofencePassed: isGpsOk,
                    biometricsPassed: isFaceOk,
                    livenessPassed: livenessVerified === true,
                    qrCodeBackupPassed: isQrOk
                }
            });
        }
        if (db_1.isMemoryDbActive) {
            // Prevent duplicate log
            const duplicate = db_1.memoryStore.attendance.find(a => a.studentId === studentId && a.lectureId === lectureId);
            if (duplicate) {
                return res.status(400).json({ success: false, message: 'Attendance already marked for this lecture.' });
            }
            const log = {
                id: Math.random().toString(36).substr(2, 9),
                studentId,
                lectureId,
                timestamp: new Date(),
                status: 'Present',
                verificationMethods: methods,
                coordinates: { latitude, longitude }
            };
            db_1.memoryStore.attendance.push(log);
            return res.status(201).json({ success: true, message: 'Attendance logged successfully (Memory DB).', log });
        }
        // Mongoose logic (prevent duplicates caught by compound index)
        try {
            const log = await Attendance_1.Attendance.create({
                studentId,
                lectureId,
                status: 'Present',
                verificationMethods: methods,
                coordinates: { latitude, longitude }
            });
            return res.status(201).json({ success: true, message: 'Attendance logged successfully.', log });
        }
        catch (dbErr) {
            if (dbErr.code === 11000) {
                return res.status(400).json({ success: false, message: 'Attendance already marked for this lecture.' });
            }
            throw dbErr;
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/attendance/reports/:lectureId
 * @desc    Get attendance logs for a specific lecture (Admin only)
 */
router.get('/reports/:lectureId', auth_1.protect, (0, auth_1.authorize)('admin'), async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (db_1.isMemoryDbActive) {
            const logs = db_1.memoryStore.attendance.filter(a => a.lectureId === lectureId);
            // Populate student info
            const populatedLogs = logs.map(l => {
                const stud = db_1.memoryStore.users.find(u => u.id === l.studentId);
                return {
                    ...l,
                    student: stud ? { name: stud.name, email: stud.email } : null
                };
            });
            return res.json({ success: true, logs: populatedLogs });
        }
        const logs = await Attendance_1.Attendance.find({ lectureId })
            .populate('studentId', 'name email')
            .exec();
        return res.json({ success: true, logs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/attendance/student-logs
 * @desc    Get logged in student personal logs
 */
router.get('/student-logs', auth_1.protect, (0, auth_1.authorize)('student'), async (req, res) => {
    try {
        const studentId = req.user?.id;
        if (db_1.isMemoryDbActive) {
            const logs = db_1.memoryStore.attendance.filter(a => a.studentId === studentId);
            const populated = logs.map(l => {
                const lect = db_1.memoryStore.lectures.find(le => le.id === l.lectureId);
                return {
                    ...l,
                    lecture: lect ? { subjectName: lect.subjectName, date: lect.startTime } : null
                };
            });
            return res.json({ success: true, logs: populated });
        }
        const logs = await Attendance_1.Attendance.find({ studentId })
            .populate({
            path: 'lectureId',
            select: 'subjectName startTime',
            populate: { path: 'classroomId', select: 'name' }
        })
            .exec();
        return res.json({ success: true, logs });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
/**
 * @route   GET /api/attendance/defaulters
 * @desc    Get students whose overall attendance rate is < 75% (Admin only)
 */
router.get('/defaulters', auth_1.protect, (0, auth_1.authorize)('admin'), async (req, res) => {
    try {
        if (db_1.isMemoryDbActive) {
            // Calculate attendance rate in memory Store
            const students = db_1.memoryStore.users.filter(u => u.role === 'student');
            const totalLectures = db_1.memoryStore.lectures.length;
            if (totalLectures === 0) {
                return res.json({ success: true, defaulters: [] });
            }
            const defaultersList = [];
            for (const student of students) {
                const studentPresents = db_1.memoryStore.attendance.filter(a => a.studentId === student.id && a.status === 'Present').length;
                const rate = (studentPresents / totalLectures) * 100;
                if (rate < 75) {
                    defaultersList.push({
                        student: { id: student.id, name: student.name, email: student.email },
                        presentCount: studentPresents,
                        totalLectures,
                        rate: Math.round(rate * 10) / 10
                    });
                }
            }
            return res.json({ success: true, defaulters: defaultersList });
        }
        // MongoDB Mongoose query using aggregation framework
        const totalLectures = await Lecture_1.Lecture.countDocuments();
        if (totalLectures === 0) {
            return res.json({ success: true, defaulters: [] });
        }
        // Match present records, group by student, filter those with percentage < 75%
        const aggregation = await Attendance_1.Attendance.aggregate([
            { $match: { status: 'Present' } },
            {
                $group: {
                    _id: '$studentId',
                    presentCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    studentId: '$_id',
                    presentCount: 1,
                    rate: { $multiply: [{ $divide: ['$presentCount', totalLectures] }, 100] }
                }
            },
            { $match: { rate: { $lt: 75 } } }
        ]);
        // Populate student profiles
        const populated = await User_1.User.populate(aggregation, {
            path: 'studentId',
            select: 'name email'
        });
        const defaultersList = populated.map((item) => ({
            student: item.studentId,
            presentCount: item.presentCount,
            totalLectures,
            rate: Math.round(item.rate * 10) / 10
        }));
        return res.json({ success: true, defaulters: defaultersList });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.default = router;
