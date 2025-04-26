import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";

// Zod schema validation
const studentSchemaZod = z.object({
  studentId: z
    .string()
    .min(1, { message: "Student ID is require" })
    .max(100, { message: "Student ID is too long " })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// // This is the TypeScript type for input validation
type StudentInput = z.infer<typeof studentSchemaZod>;

interface IStudent extends Document {
  studentId?: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// mongoose validation

const studentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// create model
const Student = mongoose.model<IStudent>("Student", studentSchema);

export { Student, studentSchemaZod, StudentInput };
