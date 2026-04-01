import { Router } from "express";
import { loginTutor } from "../controllers/authTutorController";

const router = Router();

router.post("/auth/tutor/login", loginTutor);

export default router;