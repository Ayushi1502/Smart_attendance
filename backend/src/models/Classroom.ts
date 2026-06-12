import mongoose, { Schema, Document } from 'mongoose';

export interface IClassroom extends Document {
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  createdAt: Date;
}

const ClassroomSchema: Schema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, default: 50 }, // Geofence boundary check radius in meters
  createdAt: { type: Date, default: Date.now }
});

export const Classroom = mongoose.models.Classroom || mongoose.model<IClassroom>('Classroom', ClassroomSchema);
