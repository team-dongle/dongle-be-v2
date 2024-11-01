import { Router } from "express";
import NoticeController from "../../controllers/notice.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const router = Router();
export const path = "/notices";

router.get("/", new NoticeController().getAllNotices);
router.get("/:noticeId", authMiddleware, new NoticeController().getNoticeById);
router.post("/create", authMiddleware, new NoticeController().createNotice);
router.delete(
  "/:noticeId",
  authMiddleware,
  new NoticeController().deleteNotice,
);
router.put("/:noticeId", authMiddleware, new NoticeController().updateNotice);
