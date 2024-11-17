import { Router } from "express";
import * as auth from "./auth.route";
import * as user from "./users.route";
import * as club from "./club.route";
import * as category from "./category.route";
import * as notice from "./notice.route";
import * as upload from "./upload.route";
import * as download from "./download.route";

export const router = Router();
export const path = "/v1";

router.use(auth.path, auth.router);
router.use(user.path, user.router);
router.use(club.path, club.router);
router.use(category.path, category.router);
router.use(notice.path, notice.router);
router.use(upload.path, upload.router);
router.use(download.path, download.router);
