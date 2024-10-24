import { Router } from "express";
import AuthController from "../../controllers/auth.controller";

export const router = Router();
export const path = "/auth";

router.post("/login", new AuthController().login);
