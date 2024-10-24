import { Router } from "express";
import UserController from "../../controllers/user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const router = Router();
export const path = "/users";

router.get("/", authMiddleware, new UserController().allUserList);
router.post("/create", authMiddleware, new UserController().createUser);
router.delete(
  "/delete/:userId",
  authMiddleware,
  new UserController().deleteUser,
);
