import express, { Application, Request, Response } from "express";
import studentsRouter from "./routes/studentsRoutes";
import QuizRouter from "./routes/quizRoutes";
import connectedDb from "./config/db";
import questionRouter from "./routes/questionRoutes";

const app: Application = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// connect to MongoDb before starting the server
connectedDb();

// Mount route
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/quizzes", QuizRouter);
app.use("/api/v1/questions", questionRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome ");
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
