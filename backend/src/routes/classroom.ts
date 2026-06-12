import express, { Response } from 'express';
import { Classroom } from '../models/Classroom';
import { protect, authorize, AuthenticatedRequest } from '../middleware/auth';
import { isMemoryDbActive, memoryStore } from '../config/db';

const router = express.Router();

/**
 * @route   POST /api/classrooms
 * @desc    Create a new classroom geofence config (Admin only)
 */
router.post('/', protect, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, latitude, longitude, radius } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Classroom config requires a name, latitude, and longitude.' });
    }

    if (isMemoryDbActive) {
      const newClass = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: radius ? Number(radius) : 50,
        createdAt: new Date()
      };
      memoryStore.classrooms.push(newClass);
      return res.status(201).json({ success: true, classroom: newClass });
    }

    const newClass = await Classroom.create({
      name,
      latitude,
      longitude,
      radius: radius || 50
    });

    return res.status(201).json({ success: true, classroom: newClass });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/classrooms
 * @desc    Get all classrooms
 */
router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (isMemoryDbActive) {
      return res.json({ success: true, classrooms: memoryStore.classrooms });
    }

    const classrooms = await Classroom.find();
    return res.json({ success: true, classrooms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/classrooms/:id
 * @desc    Get specific classroom by ID
 */
router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const classId = req.params.id;

    if (isMemoryDbActive) {
      const cls = memoryStore.classrooms.find(c => c.id === classId);
      if (!cls) {
        return res.status(404).json({ success: false, message: 'Classroom not found.' });
      }
      return res.json({ success: true, classroom: cls });
    }

    const cls = await Classroom.findById(classId);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Classroom not found.' });
    }

    return res.json({ success: true, classroom: cls });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
