import { z } from 'zod';
import { resultSchemaZod } from '../../validator/result.validator';

// Types for Input (e.g,req.body)
export type ResultInput = z.infer<typeof resultSchemaZod>;

// Type for output
export type ResultOutput = ResultInput & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};
