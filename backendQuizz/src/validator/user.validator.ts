import z from 'zod';
/*
Exercise 1: Basic Validation
Task: Validate that a username contains no spaces
*/

const usernameSchema = z.object({
  username: z.string().refine((val) => !val.includes(''), {
    message: 'Username cannot contain spaces',
  }),
});

// Exercise 2: Cross-Field Validation
// Task: Ensure password and confirmPassword match

const authSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password must match',
    path: ['confirmedPassword'],
  });

/*Exercise 3: Database Uniqueness Check
Task: Validate email isn't already registered (mock DB check)
*/
// stimulate mock "existing emails" database

const mockRegisteredEmails = ['miessanhenri@gmail.com', 'gana@gmail.com'];

const emailSchema = z
  .object({
    email: z.string().email(),
  })
  .refine((data) => !mockRegisteredEmails.includes(data.email), {
    message: 'Email is already registered ',
    path: ['email'],
  });

// Exercise 4: Complex Business Rule
// Task: Validate meeting schedule doesn't overlap working hours (9AM-5PM)

const scheduleMeeting = z
  .object({
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'Start time be in HH:MM format',
    }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      message: 'End time must be in HH:HH format',
    }),
  })
  .refine((data) => data.startTime >= '09:00' && data.endTime < '17:00', {
    message: 'Start time must be between 09:00 and 17:00',
    path: ['statTime '],
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time ',
    path: ['endTime'],
  });

/**
   * Exercise 5: Conditional Validation
Task: Require visa number only if paymentMethod is "credit_card"

   */

const paymentSchema = z
  .object({
    paymentMethod: z.enum(['credit_card', 'paypal', 'cash']),
    visaNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'credit_card') {
        return data.visaNumber && data.visaNumber.trim() !== '';
      }
      return true;
    },
    {
      message: 'visa number is required  when using credit card ',
      path: ['visaNumber'],
    }
  );
