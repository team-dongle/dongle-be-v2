import { Router } from "express";
import ClubController from "../../controllers/club.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const router = Router();
export const path = "/clubs";

router.get("/", new ClubController().allClubs);
router.post("/create", authMiddleware, new ClubController().createClub);
router.get("/:clubId", new ClubController().clubDetail);
router.delete("/:clubId", authMiddleware, new ClubController().deleteClub);
router.put("/:clubId", authMiddleware, new ClubController().updateClub);
