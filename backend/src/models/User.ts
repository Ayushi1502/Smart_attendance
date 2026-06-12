import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  faceEmbedding?: number[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  faceEmbedding: { type: [Number], default: undefined }, // 128-dimensional facial landmarks vector
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
