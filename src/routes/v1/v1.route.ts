import { Router } from "express";
import * as auth from "./auth.route";
import * as user from "./users.route";

export const router = Router();
export const path = "/v1";

router.use(auth.path, auth.router);
router.use(user.path, user.router);
