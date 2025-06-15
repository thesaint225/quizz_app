// Import mongoose components

import mongoose, { Schema, model, Document } from 'mongoose';
import { Student } from './studentsModel';
import { questionSchema, QuestionsModel } from './questionsModels';

/**
 * MONGOOSE INTERFACE
 * Defines the structure of the session  document with
 * TypeScript support
 */

interface ISession extends Document {
  // Reference to Student
  studentId: mongoose.Types.ObjectId;
  //   reference to quiz
  quizId: mongoose.Types.ObjectId;
  //   student's answer
  answers: Array<{
    // reference to to Student
    questionId: mongoose.Types.ObjectId;
    // student question
    answer: string;
  }>;
  // quiz state
  status: 'in-progress' | 'completed' | 'failed';
  // when quiz started
  startedAt?: Date;
  //   when quiz was submitted
  endTime?: Date;
  //   auto-added by timeStamp
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * MONGOOSE SCHEMA
 * Defines how the session  is  stored in MongoDB with validation
 */

const sessionSchema = new Schema<ISession>(
  {
    // References the student taking this section
    studentId: {
      type: Schema.Types.ObjectId,
      ref: Student,
      required: [true, 'Student ID is required '],
      // improved query performance
      index: true,
    },

    //   Reference to quiz being attempted
    quizId: {
      type: Schema.Types.ObjectId,
      ref: QuestionsModel,
      required: [true, 'Quiz ID is required'],
      index: true,
    },

    //   Array of student answers  with validation
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: questionSchema,
          required: [true, 'Answer text is required '],
        },
        answer: {
          type: String,
          required: [true, 'Answer text is required'],
          // remove white space
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: {
        values: ['in-progress', 'completed', 'failed'],
        message: '{VALUE}  must be either in-progress,completed or failed',
      },
      default: 'in-progress',
    },

    // Tracks when the quiz was submitted / end
    endTime: {
      type: Date,
      validate: {
        validator: function (this: ISession, value: Date) {
          // If endTime is not provided (null or undefined )it is valid
          if (!value) {
            return true;
          }
          // If created exists , make sure endTime is after createdAt
          if (this.createdAt) {
            return value > this.createdAt;
          }
          // if for some reason createAt  doesn't exist ,allow it
          return true;
        },
        message: 'End time must be after the session start time (createdAt)',
      },
    },
  },
  {
    // Auto-add  createdAt and updatedAt
    timestamps: true,
    // Including virtuals when converting to json
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 3.Add Index for better Query Performance
sessionSchema.index({ studentId: 1, quizId: 1 }, { unique: true });

export const SessionModel = model<ISession>('Session', sessionSchema);
