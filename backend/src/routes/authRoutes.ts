import { Router } from "express";
import { loginAdmin } from "../controllers/authController";

const router = Router();

router.post("/auth/admin/login", loginAdmin);

export default router;

