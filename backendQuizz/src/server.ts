import express, { Application, Request, Response } from "express";
import router from "./routes/studentsRoutes";

const app: Application = express();
const PORT = 5000;

// Mildeware to parse JSON
app.use(express.json());

// Mount route
app.use("/api/v1/students", router);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome ");
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
