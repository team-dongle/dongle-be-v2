import { Router } from "express";
import * as auth from "./auth.route";

export const router = Router();
export const path = "/v1";

router.use(auth.path, auth.router);
