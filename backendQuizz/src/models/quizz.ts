import { number, z } from "zod";
import mongoose, { Document, Mongoose, Schema } from "mongoose";

// Zod Schema validation
const quizSchemaZod = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  quizCode: z.string().min(1, { message: "Quizz Code is required " }),
  duration: z.number().min(1, { message: "Duration must be at least 1 min" }),
  question: z
    .array(z.string())
    .min(1, { message: "At Least one question ID is " })
    .optional(),
});

// this is the TypeScript type for input validation

export type QuizInput = z.infer<typeof quizSchemaZod>;

// interface for Mongoose document
interface IQuiz extends Document {
  title: String;
  quizCode: string;
  duration: number;
  question: mongoose.Types.ObjectId[];
}

// mongoose validation

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      quizCode: String,
      duration: Number,
      question: [
        {
          type: mongoose.Schema.Types.ObjectId,
          //Make sure this matches your Question model
          ref: "Question",
          require: false,
        },
      ],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// export the mongoose model

const QuizModel = mongoose.model<IQuiz>("Quiz", quizSchema);

export { QuizModel, quizSchema, quizSchemaZod };
