import mongoose, { Document } from 'mongoose';

export interface Iquestion extends Document {
  quizId: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correct: string;
  createdAT?: Date;
  updatedAt?: Date;
}
