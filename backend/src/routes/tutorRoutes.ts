import { Router } from "express";
import {
  getTutores,
  getTutorPorId,
  postTutor,
  putTutor,
  patchStatusTutor,
  deleteTutor
} from "../controllers/tutorController";

const router = Router();

router.get("/tutores", getTutores);
router.get("/tutores/:id", getTutorPorId);
router.post("/tutores", postTutor);
router.put("/tutores/:id", putTutor);
router.patch("/tutores/:id/status", patchStatusTutor);
router.delete("/tutores/:id", deleteTutor);

export default router;