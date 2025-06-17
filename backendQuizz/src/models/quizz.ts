// Import ZOD library for schema validation
import { z } from 'zod';
// Import mongoose and necessary types for MongoDB interaction
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Zod Validation Schema
 * validates input data when creating / updating quizzes
 */
const quizSchemaZod = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),

  quizCode: z
    .string()
    .min(3, { message: 'Quiz code must be at least 3 characters' })
    .max(20, { message: 'Quiz code cannot exceed 20 characters' }),

  duration: z
    .number()
    .min(1, { message: 'Duration must be at least 1 minute' })
    .max(300, { message: 'Duration cannot exceed 300 minutes' }),
});

/**
 * TypeScript Type for Quiz Input
 * Automatically generated from the Zod schema
 */
export type QuizInput = z.infer<typeof quizSchemaZod>;

/**
 * Mongoose Document Interface
 * Defines the structure of quiz documents in MongoDB
 */

interface IQuiz extends Document {
  title: String;
  quizCode: string;
  duration: number;
  questions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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

const QuizModel = mongoose.model<IQuiz>('Quiz', quizSchema);

export { QuizModel, quizSchema, quizSchemaZod };
