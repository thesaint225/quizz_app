import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("welcome ");
});

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
