/quiz-app-backend
│
├── /node_modules # Node.js dependencies (auto-generated)
├── /src # All source code goes here
│ ├── /controllers # Logic for handling requests and responses
│ │ ├── authController.js # Authentication routes (login, register)
│ │ ├── quizController.js # Logic for quiz management
│ │ ├── studentController.js # Logic for student operations
│ │ └── resultController.js # Handle results and scores
│ │
│ ├── /models # Mongoose models (schemas for DB)
│ │ ├── student.js # Student schema
│ │ ├── quiz.js # Quiz schema
│ │ ├── question.js # Question schema
│ │ └── result.js # Result schema (store student scores)
│ │
│ ├── /routes # Express routes for the API
│ │ ├── authRoutes.js # Routes related to authentication (login, signup)
│ │ ├── quizRoutes.js # Routes related to quiz management (start, submit)
│ │ ├── studentRoutes.js # Routes for student-specific actions (get student, etc.)
│ │ └── resultRoutes.js # Routes for results (get results, store results)
│ │
│ ├── /utils # Helper functions, utilities (like validation, etc.)
│ │ └── validate.js # Helper for validating input data or tokens
│ │
│ ├── /middleware # Middlewares (e.g., authentication, authorization)
│ │ └── authMiddleware.js # Protect routes with student authentication
│ │
│ ├── /config # Configuration files (e.g., DB, server config)
│ │ └── db.js # MongoDB connection setup
│ │
│ └── server.js # Main server entry point (set up Express)
│
├── .env # Environment variables (DB_URI, JWT_SECRET, etc.)
├── package.json # NPM package manager file (dependencies, scripts)
├── package-lock.json # Auto-generated, version lock for dependencies
└── README.md # Project description and instructions

1. Backend Structure Overview
   Collections (MongoDB)
   a)students
   Field Type Notes
   \_id ObjectId Auto-generated
   studentId String e.g., "RB12"
   securityAnswer String Optional for identity check

b)quizzes
Field Type Notes
\_id ObjectId Auto-generated
title String e.g., "Math Quiz 1"
quizCode String Code used to join the quiz
duration Number In minutes
questions [ObjectId] Refers to questions
questions
Field Type Notes
\_id ObjectId
quizId ObjectId Reference to quizzes
text String Question content
options [String] Multiple choice options
correct String Correct answer

c)sessions
Field Type Notes
\_id ObjectId
studentId String e.g., "RB12"
quizId ObjectId
answers [Object] { qId, selectedOption }
status String "in-progress", "submitted"
startTime Date For timer tracking
currentIndex Number Last question viewed (for resume)

[ Student Login ]
|
v
POST /api/auth/login
--> Verify ID + quiz code
--> Return session token

     |
     v

GET /api/quiz/:quizId/start
--> Return first question + timer
--> Record start time

     |
     v

POST /api/quiz/:quizId/save
--> Auto-save answer as student progresses

     |
     v

POST /api/quiz/:quizId/submit
--> Lock session
--> Evaluate answers
--> Return result

     |
     v

GET /api/result/:studentId
--> Return score + quiz summary

let work with this

1. Student logs in --> AuthController
2. Starts a quiz --> QuizController
3. Receives questions --> Quiz + Questions
4. Saves answers --> SessionController
5. Submits quiz --> ResultController
6. Sees results --> Result

🔧 Backend Structure (Big Picture)

1. Student
   Represents the person taking the quiz.

Fields: studentId, email, securityAnswer

Use: To identify and validate users

✅ Used during login and when submitting answers

2. Quiz
   Represents a quiz as a whole.

Fields: title, quizCode, duration, questions[]

Use: Stores quiz settings and links to its questions

✅ Used to start a quiz and control the timer

3. Question
   Individual questions within a quiz.

Fields: quizId, text, options[], correct

Use: Stores each question and the correct answer

✅ Used during the quiz to show options and check answers later

4. Session / Answers
   Represents a student’s attempt at a quiz.

Fields: studentId, quizId, answers[], status, startTime, currentIndex

Use: Tracks the student’s progress and answers

✅ Used for auto-saving answers and resuming quizzes

5. Result
   Stores final scores and summaries.

Fields: studentId, quizId, score, submittedAt, etc.

Use: Displays result after quiz is submitted

✅ Used for the result screen / summary

:

📚 Core Features of the Quiz App
🧩 Core Flow (Backend)
1.Student Login

Verify email and password.
If valid, respond with student information (JWT not used for now).

2.Start Quiz
Student selects a quiz by quiz code or ID.
Backend responds with:
Quiz title
First question
Quiz duration (timer)

3.Save Answers (During Quiz)
Student answers a question.
Backend saves the answer in the Session for progress tracking.
Backend updates the currentIndex to know the student's current question.

4.Submit Quiz
Student presses "Submit" to complete the quiz.
Backend:
Marks the session as "submitted".
Calculates the score by comparing the student's answers to the correct ones.
Saves the score and a summary into the Result collection.

5.Show Result
Student can view:
Total score
Quiz summary (such as correct and incorrect answers)

📂 Folders Handling Each Step

Feature Controller File
Login controllers/authController.ts
Start Quiz controllers/quizController.ts
Save Answers controllers/sessionController.ts
Submit Quiz controllers/resultController.ts
Show Result controllers/resultController.ts

Data Flow for model :

Client sends data →

Zod validates input →

TypeScript checks types →

Mongoose validates schema →

Pre-hooks run final checks →

Data saved to MongoDB"
