import { Router } from "express";
import NoticeController from "../../controllers/notice.contoroller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const router = Router();
export const path = "/notices";

router.get("/list", new NoticeController().getAllNotices);
router.get("/list/:noticeId", authMiddleware, new NoticeController().getNoticeById);
router.post("/create", authMiddleware, new NoticeController().createNotice);
router.delete("/delete/:noticeId", authMiddleware, new NoticeController().deleteNotice);
router.put("/update/:noticeId", authMiddleware, new NoticeController().updateNotice);
