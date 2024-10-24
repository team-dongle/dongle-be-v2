import { Router } from "express";
import ClubController from "../../controllers/club.controller";

export const router = Router();
export const path = "/clubs";

router.get("/", new ClubController().allClubs);
