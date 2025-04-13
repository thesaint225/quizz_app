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
