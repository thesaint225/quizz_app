import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IStudent } from './interfaces/student.interface';
import { StudentInput, studentSchemaZod } from '../validator/student.validator';

// mongoose validation

const studentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// create model
const Student = mongoose.model<IStudent>('Student', studentSchema);

export { Student, studentSchemaZod, StudentInput };
