import express, { Application, Request, Response } from "express";
import router from "./routes/studentsRoutes";
import connectedDb from "./config/db";

const app: Application = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// connect to MongoDb before starting the server
connectedDb();

// Mount route
app.use("/api/v1/students", router);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome ");
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
