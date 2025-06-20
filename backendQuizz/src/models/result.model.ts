import mongoose, { Schema } from 'mongoose';
import { IResult, IResultModel } from '../interfaces/result.interface';
import { ResultInput, resultSchemaZod } from '../validator/result.validator';

const resultSchema = new Schema<IResult, IResultModel>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: () => 'Student',
      required: [true, 'student ID is required'],
      index: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: () => 'Quiz',
      required: [true, 'Quiz ID is required'],
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100%'],
    },
    totalQuestion: {
      type: Number,
      required: [true, 'Total question count is required '],
      min: [1, 'At least one question is required '],
    },
    SubmittedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
        return ret;
      },
    },
  }
);

resultSchema.index({ studentId: 1, quizId: 1 }, { unique: true });

resultSchema.statics.createResult = async function (resultData: ResultInput) {
  const validatedData = resultSchemaZod.parse(resultData);
  return this.create({
    ...validatedData,
    studentId: new mongoose.Types.ObjectId(validatedData),
  });
};
