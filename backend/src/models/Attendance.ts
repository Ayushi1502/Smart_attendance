import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  lectureId: mongoose.Types.ObjectId;
  timestamp: Date;
  status: 'Present' | 'Absent';
  verificationMethods: ('Face' | 'GPS' | 'QR')[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const AttendanceSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lectureId: { type: Schema.Types.ObjectId, ref: 'Lecture', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
  verificationMethods: [{ type: String, enum: ['Face', 'GPS', 'QR'] }],
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

// A student cannot have multiple logs for the same lecture
AttendanceSchema.index({ studentId: 1, lectureId: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
