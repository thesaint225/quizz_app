// Import Zod library for schema validation
import { z } from "zod";
// Import mongoose and necessary types for MongoDB interaction
import mongoose, { Document, Schema } from "mongoose";

/**
 * ZOD VALIDATION
 * this define the validation rules for question data before it
 * reaches the database
 */

const questionZodSchema = z
  .object({
    quizId: z.string().min(1, { message: "Quiz ID is required" }),
    // validate "text" field must  be non-empty string
    text: z.string().min(1, { message: "Question text is required" }),
    // validate "options" must be an array with at least 2 string
    options: z
      .array(z.string())
      .min(2, { message: "At least two options are required" }),
    correct: z.string().min(1, { message: "Correct answer is required" }),
  })
  .refine((data) => data.options.includes(data.correct), {
    path: ["correct"],
    message: "Correct answer must be one of the options",
  });

/**
 * TYPESCRIPT TYPE
 * Create a TypeScript type based on the zod schema for
 * type-safe development
 */

export type QuestionInput = z.infer<typeof questionZodSchema>;

/**
 * MONGOOSE INTERFACE
 * Defines the structure of a question document with
 * TypeScript support
 */

export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correct: string;
  createdAT?: Date;
  updatedAt?: Date;
}
/**
 * MONGOOSE SCHEMA
 * Defines how questions are stored in MongoDB with validation
 */
const questionSchema = new Schema<IQuestion>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz reference is required "],
    },

    // Question text itself
    text: { type: String, required: [true, "Question text is required "] },

    // Array of possible answers
    options: {
      type: [String],
      required: [true, "options are required"],
      validate: {
        validator: (options: string[]) => options.length >= 2,
        message: "At least 2 options are required",
      },
    },
    correct: { type: String, required: [true, "Correct answer is required "] },
  },
  {
    timestamps: true,
  }
);

/**
 * PRE-UPDATE HOOK
 * Runs validation before updating an existing question document
 */

questionSchema.pre("findOneAndUpdate", async function (next) {
  // Get the updated data from request
  const update = this.getUpdate() as any;
  // both correct answer and options  are being updates

  //   Update Received
  //     |
  //     v
  // Does it contain BOTH correct AND options?
  //     /       \
  //    Yes       No
  //     |         |
  //     v         v
  // Check if correct → If invalid:
  // is in options      Throw Error
  //     |
  //     v
  // Allow Update

  if (update.correct && update.options) {
    // check if new correct answer  exists in new  options
    if (!update.options.includes(update.correct)) {
      throw new Error("Correct answer must be one of the provided options");
    }
  }

  // if only correct answer is being updated
  else if (update.correct) {
    // First check if document exists

    // 1. Get the document with proper typing
    const doc = await this.model.findOne<IQuestion>(this.getQuery()).exec();

    // 2. Now TypeScript knows doc has an 'options' property
    // First check if document exists
    if (!doc) {
      throw new Error("Question not found");
    }

    if (!doc.options.includes(update.correct)) {
      throw new Error("Correct answer must be one of the provided answers");
    }
  }

  next();
});

const QuestionsModel = mongoose.model<IQuestion>("Question", questionSchema);

export { questionSchema, QuestionsModel, questionZodSchema };
