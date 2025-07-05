import mongoose, { Document } from 'mongoose';
export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correct: string;
  createdAt?: Date;
  updatedAt?: Date;
}
