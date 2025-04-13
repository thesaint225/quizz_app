import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// Zod schema validation
const studentSchemaZod = z.object({
  studentId: z
    .string()
    .min(1, { message: "Student ID is require" })
    .max(100, { message: "Student ID is too long " }),
  securityAnswer: z.string().min(1, { message: "Security answer is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

// // This is the TypeScript type for input validation
type StudentInput = z.infer<typeof studentSchemaZod>;

// mongoose validation

const studentSchema = new Schema<IStudent>(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    securityAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IStudent extends Document {
  studentId: string;
  securityAnswer: string;
  email: string;
}

// create model
const Student = mongoose.model<IStudent>("Student", studentSchema);

export { Student, studentSchemaZod, StudentInput };
