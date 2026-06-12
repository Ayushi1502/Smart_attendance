import express, { Response } from 'express';
import { Attendance } from '../models/Attendance';
import { Lecture } from '../models/Lecture';
import { Classroom } from '../models/Classroom';
import { User } from '../models/User';
import { protect, authorize, AuthenticatedRequest } from '../middleware/auth';
import { isWithinGeofence } from '../utils/geo';
import { verifyFaceEmbeddings } from '../utils/face';
import { isMemoryDbActive, memoryStore } from '../config/db';

const router = express.Router();

/**
 * @route   POST /api/attendance/check-in
 * @desc    Verify coordinates and biometrics to mark attendance
 */
router.post('/check-in', protect, authorize('student'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { lectureId, latitude, longitude, faceEmbedding, livenessVerified, qrCode } = req.body;

    if (!lectureId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Missing check-in parameters: lectureId, latitude, longitude.' });
    }

    let lecture: any;
    let classroom: any;
    let student: any;

    if (isMemoryDbActive) {
      lecture = memoryStore.lectures.find(l => l.id === lectureId);
      student = memoryStore.users.find(u => u.id === studentId);
      if (lecture) {
        classroom = memoryStore.classrooms.find(c => c.id === lecture.classroomId);
      }
    } else {
      lecture = await Lecture.findById(lectureId);
      student = await User.findById(studentId);
      if (lecture) {
        classroom = await Classroom.findById(lecture.classroomId);
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
    const methods: ('Face' | 'GPS' | 'QR')[] = [];
    let isGpsOk = false;
    let isFaceOk = false;

    // 1. Geofence Location Check
    isGpsOk = isWithinGeofence(latitude, longitude, classroom.latitude, classroom.longitude, classroom.radius);
    if (isGpsOk) {
      methods.push('GPS');
    }

    // 2. Face Biometrics matching & Liveness check
    if (faceEmbedding && Array.isArray(faceEmbedding) && student.faceEmbedding) {
      const match = verifyFaceEmbeddings(faceEmbedding, student.faceEmbedding);
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

    if (isMemoryDbActive) {
      // Prevent duplicate log
      const duplicate = memoryStore.attendance.find(a => a.studentId === studentId && a.lectureId === lectureId);
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

      memoryStore.attendance.push(log);
      return res.status(201).json({ success: true, message: 'Attendance logged successfully (Memory DB).', log });
    }

    // Mongoose logic (prevent duplicates caught by compound index)
    try {
      const log = await Attendance.create({
        studentId,
        lectureId,
        status: 'Present',
        verificationMethods: methods,
        coordinates: { latitude, longitude }
      });

      return res.status(201).json({ success: true, message: 'Attendance logged successfully.', log });
    } catch (dbErr: any) {
      if (dbErr.code === 11000) {
        return res.status(400).json({ success: false, message: 'Attendance already marked for this lecture.' });
      }
      throw dbErr;
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/attendance/reports/:lectureId
 * @desc    Get attendance logs for a specific lecture (Admin only)
 */
router.get('/reports/:lectureId', protect, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lectureId } = req.params;

    if (isMemoryDbActive) {
      const logs = memoryStore.attendance.filter(a => a.lectureId === lectureId);
      // Populate student info
      const populatedLogs = logs.map(l => {
        const stud = memoryStore.users.find(u => u.id === l.studentId);
        return {
          ...l,
          student: stud ? { name: stud.name, email: stud.email } : null
        };
      });
      return res.json({ success: true, logs: populatedLogs });
    }

    const logs = await Attendance.find({ lectureId })
      .populate('studentId', 'name email')
      .exec();

    return res.json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/attendance/student-logs
 * @desc    Get logged in student personal logs
 */
router.get('/student-logs', protect, authorize('student'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const studentId = req.user?.id;

    if (isMemoryDbActive) {
      const logs = memoryStore.attendance.filter(a => a.studentId === studentId);
      const populated = logs.map(l => {
        const lect = memoryStore.lectures.find(le => le.id === l.lectureId);
        return {
          ...l,
          lecture: lect ? { subjectName: lect.subjectName, date: lect.startTime } : null
        };
      });
      return res.json({ success: true, logs: populated });
    }

    const logs = await Attendance.find({ studentId })
      .populate({
        path: 'lectureId',
        select: 'subjectName startTime',
        populate: { path: 'classroomId', select: 'name' }
      })
      .exec();

    return res.json({ success: true, logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/attendance/defaulters
 * @desc    Get students whose overall attendance rate is < 75% (Admin only)
 */
router.get('/defaulters', protect, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isMemoryDbActive) {
      // Calculate attendance rate in memory Store
      const students = memoryStore.users.filter(u => u.role === 'student');
      const totalLectures = memoryStore.lectures.length;
      
      if (totalLectures === 0) {
        return res.json({ success: true, defaulters: [] });
      }

      const defaultersList = [];
      for (const student of students) {
        const studentPresents = memoryStore.attendance.filter(
          a => a.studentId === student.id && a.status === 'Present'
        ).length;

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
    const totalLectures = await Lecture.countDocuments();
    if (totalLectures === 0) {
      return res.json({ success: true, defaulters: [] });
    }

    // Match present records, group by student, filter those with percentage < 75%
    const aggregation = await Attendance.aggregate([
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
          rate: { $multiply: [ { $divide: [ '$presentCount', totalLectures ] }, 100 ] }
        }
      },
      { $match: { rate: { $lt: 75 } } }
    ]);

    // Populate student profiles
    const populated = await User.populate(aggregation, {
      path: 'studentId',
      select: 'name email'
    });

    const defaultersList = populated.map((item: any) => ({
      student: item.studentId,
      presentCount: item.presentCount,
      totalLectures,
      rate: Math.round(item.rate * 10) / 10
    }));

    return res.json({ success: true, defaulters: defaultersList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
