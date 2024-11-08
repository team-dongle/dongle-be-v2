import { RequestHandler } from "express";
import NoticeService from "../services/notice.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";
import { ApiError } from "../utils/error";

export default class NoticeController {
  public getAllNotices: RequestHandler = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const size = parseInt(req.query.size as string, 10) || 10;

      const result = await new NoticeService().getAllNotices(page, size);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public createNotice: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const { title, content } = req.body;
      await new NoticeService().createNotice({
        title,
        content,
        username: req.username,
      });

      res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public deleteNotice: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const noticeId = parseInt(req.params.noticeId, 10);

      await new NoticeService().deleteNotice(noticeId);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public updateNotice: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const noticeId = parseInt(req.params.noticeId, 10);
      const { title, content } = req.body;

      await new NoticeService().updateNotice(noticeId, { title, content });

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public getNoticeById: RequestHandler = async (req, res, next) => {
    try {
      const noticeId = parseInt(req.params.noticeId, 10);

      const result = await new NoticeService().getNoticeById(noticeId);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
