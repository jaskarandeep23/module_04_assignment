import { Router } from "express";
import { signIn } from "../controllers/authController";

const router = Router();

router.post("/signIn", signIn);

export default router;