import { Router } from "express";
import DownloadController from "../../controllers/download.controller";

export const router = Router();
export const path = "/download";

router.get("/files/:fileName", new DownloadController().downloadFile);
