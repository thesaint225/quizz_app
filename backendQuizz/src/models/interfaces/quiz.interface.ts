import mongoose, { Document } from 'mongoose';
export interface IQuiz extends Document {
  title: string;
  quizCode: string;
  duration: number;
  questions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  questionCount?: number;
}
