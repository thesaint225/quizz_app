import mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { ResultInput } from '../../schemas/types/result.type';

export interface IResult extends Document {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  score: number;
  totalQuestions: number;
  // percentage?: number;
  submittedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResultModel extends Model<IResult> {
  createStudentResult(resultData: ResultInput): Promise<IResult>;
}
