import { z } from "zod";
import mongoose, { Document, Schema } from "mongoose";

// zod validation

const questionZodSchema = z
  .object({
    quizId: z.string().min(1, { message: "Quiz ID is required" }),
    text: z.string().min(1, { message: "Question text is required" }),
    options: z
      .array(z.string())
      .min(2, { message: "At least two options are required" }),
    correct: z.string().min(1, { message: "Correct answer is required" }),
  })
  .refine((data) => data.options.includes(data.correct), {
    path: ["correct"],
    message: "Correct answer must be one of the options",
  });

// export type for request validation
export type QuestionInput = z.infer<typeof questionZodSchema>;

// Interface for typeScript

export interface IQuestions extends Document {
  quizId: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correct: string;
}

// Mongoose Schema
const questionSchema = new Schema<IQuestions>(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length >= 2,
        "At least 2 options required",
      ],
    },
    correct: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionsModel = mongoose.model<IQuestions>("Question", questionSchema);

export { questionSchema, QuestionsModel, questionZodSchema };
