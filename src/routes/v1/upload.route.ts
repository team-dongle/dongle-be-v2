import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../utils/multer";
import { env } from "../../utils/env";
import { Router } from "express";
import UploadController from "../../controllers/upload.controller";

export const router = Router();
export const path = "/upload";

router.post(
  "/logo",
  authMiddleware,
  upload("logos", env.bucket.allow_exts_img, 2).single("image"),
  new UploadController().uploadClubLogo,
);
router.post(
  "/attachment",
  authMiddleware,
  upload("files", env.bucket.allow_exts_file, 5).single("file"),
  new UploadController().uploadAttachment,
);
