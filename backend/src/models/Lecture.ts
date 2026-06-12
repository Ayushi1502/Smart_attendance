import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  classroomId: mongoose.Types.ObjectId;
  subjectName: string;
  startTime: Date;
  endTime: Date;
  qrCode: string; // Dynamic time-limited QR string
  createdAt: Date;
}

const LectureSchema: Schema = new Schema({
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  subjectName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  qrCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Lecture = mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);
