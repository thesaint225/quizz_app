import mongoose, { Document } from 'mongoose';
export interface IQuiz extends Document {
  title: string;
  quizCode: string;
  duration: number;
  questions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Virtual Property: questionCount
 * Returns the number of questions without loading all question documents
 */
declare module 'mongoose' {
  interface IQuiz {
    questionCount: number;
  }
}
