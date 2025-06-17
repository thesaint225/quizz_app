import { Router } from 'express';
import { createSession } from '../controllers/sessionController';

const sessionRoute = Router();
// @route   POST /api/sessions
// @desc    Create a new session
// @access  Public or Protected (based on your setup)

sessionRoute.post('/', createSession);

export default sessionRoute;
