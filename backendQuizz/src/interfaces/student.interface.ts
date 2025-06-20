import { Document } from 'mongoose';

export interface IStudent extends Document {
  studentId?: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
