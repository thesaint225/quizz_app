import mongoose, { Document } from 'mongoose';
import { ResultInput } from '../validator/result.validator';

export interface IResult
  extends Document,
    Omit<ResultInput, 'studentId' | 'quizId'> {
  studentId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// extended Model interface for static methods
export interface IResultModel extends mongoose.Model<IResult> {
  createResult: (resultData: ResultInput) => promise<IResult>;
}
