import { Router } from "express";
import { registerStudent, loginStudent } from "../controllers/authController";

const authRouter = Router();

/**
 * @desc    register a new student
 * route    POST /api/v1/auth/register
 */
authRouter.post("/register", registerStudent);

/**
 * @desc    Login an existing student
 * route    POST /api/v1/auth/login
 */
authRouter.post("/login", loginStudent);

export default authRouter;

/**
 * {
   {
    "email": "dieudonne@gmail.com",
  "password": "test12rf%^$35"

}
}
 */
