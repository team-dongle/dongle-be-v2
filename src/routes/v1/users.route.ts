import { Router } from "express";
import UserController from "../../controllers/user.controller";

export const router = Router();
export const path = "/users";

router.get("/", new UserController().allUserList);
router.post("/create", new UserController().createUser);
router.delete("/delete/:userId", new UserController().deleteUser);
