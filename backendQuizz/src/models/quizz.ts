// Import mongoose and necessary types for MongoDB interaction
import mongoose, { Schema, model } from 'mongoose';
import { IQuiz } from './interfaces/quiz.interface';

/**
 * Mongoose Schema Definition
 * Maps to MongoDB collection and enforces data structure
 */

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    quizCode: {
      type: String,
      required: [true, 'Quiz code is required'],
      unique: true,
      minlength: [3, 'Quiz code must be at least 3 characters'],
      maxlength: [20, 'Quiz code cannot exceed 20 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [300, 'Duration cannot exceed 300 minutes'],
    },

    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: () => 'Question', // References the Question model
        default: [], // Starts empty
      },
    ],
  },
  {
    // Automatic timestamps (createdAt, updatedAt)
    timestamps: true,
  }
);

/**
 * Virtual Property: questionCount
 * Returns the number of questions without loading all question documents
 */
quizSchema.virtual('questionCount').get(function (this: IQuiz) {
  return this.questions.length;
});

/**
 * Pre-save Hook
 * Ensures quizCode remains unique before saving
 */

quizSchema.pre('save', async function (next) {
  const existingQuiz = await mongoose.models.Quiz.findOne({
    quizCode: this.quizCode,
    // Exclude current document during updates
    _id: { $ne: this._id },
  });

  if (existingQuiz) {
    throw new Error(`Quiz code ${this.quizCode} is already in use `);
  }
  next();
});

// export the mongoose model

export const Quiz = mongoose.models.Quiz || model<IQuiz>('Quiz', quizSchema);
