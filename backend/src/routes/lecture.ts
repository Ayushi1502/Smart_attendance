import express, { Response } from 'express';
import { Lecture } from '../models/Lecture';
import { protect, authorize, AuthenticatedRequest } from '../middleware/auth';
import { isMemoryDbActive, memoryStore } from '../config/db';

const router = express.Router();

/**
 * @route   POST /api/lectures
 * @desc    Schedule a new lecture session (Admin only)
 */
router.post('/', protect, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { classroomId, subjectName, startTime, endTime } = req.body;

    if (!classroomId || !subjectName || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Required fields: classroomId, subjectName, startTime, endTime.' });
    }

    // Dynamic QR code token generator
    const randomSeed = Math.random().toString(36).substring(2, 8).toUpperCase();
    const qrCode = `QR-SESSION-${subjectName.substring(0, 3).toUpperCase()}-${randomSeed}-${Date.now()}`;

    if (isMemoryDbActive) {
      // Validate classroom exists in memoryStore
      const cls = memoryStore.classrooms.find(c => c.id === classroomId);
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
      
      memoryStore.lectures.push(newLecture);
      return res.status(201).json({ success: true, lecture: newLecture });
    }

    // MongoDB Mongoose logic
    const newLecture = await Lecture.create({
      classroomId,
      subjectName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      qrCode
    });

    return res.status(201).json({ success: true, lecture: newLecture });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/lectures
 * @desc    Get all lectures
 */
router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isMemoryDbActive) {
      return res.json({ success: true, lectures: memoryStore.lectures });
    }

    const lectures = await Lecture.find().populate('classroomId', 'name');
    return res.json({ success: true, lectures });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/lectures/active
 * @desc    Get active lectures (current time within session limits)
 */
router.get('/active', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();

    if (isMemoryDbActive) {
      const active = memoryStore.lectures.filter(
        l => new Date(l.startTime) <= now && new Date(l.endTime) >= now
      );
      
      // Inject classroom name for demo
      const populated = active.map(l => {
        const cls = memoryStore.classrooms.find(c => c.id === l.classroomId);
        return { ...l, classroomName: cls ? cls.name : 'Unknown Room' };
      });

      return res.json({ success: true, lectures: populated });
    }

    // Mongoose query
    const active = await Lecture.find({
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('classroomId', 'name');

    return res.json({ success: true, lectures: active });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
