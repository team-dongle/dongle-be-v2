import { RequestHandler } from "express";
import ClubService from "../services/club.service";
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/error";

export default class ClubController {
  public allClubs: RequestHandler = async (req, res, next) => {
    try {
      const result = await new ClubService().allClubs();

      res
        .status(StatusCodes.OK)
        .json({ code: StatusCodes.OK, result: { ...result } });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public clubDetail: RequestHandler = async (req, res, next) => {
    try {
      const clubId = parseInt(req.params.clubId, 10);

      const result = await new ClubService().clubDetail(clubId);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result: result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public createClub: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const payload = req.body;

      await new ClubService().createClub(payload);

      res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public updateClub: RequestHandler = async (req, res, next) => {
    try {
      if (!req.role)
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const clubId = parseInt(req.params.clubId, 10);
      const payload = req.body;

      if (!clubId) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

      await new ClubService().updateClub(clubId, payload);

      res.status(StatusCodes.NO_CONTENT).json({ code: StatusCodes.NO_CONTENT });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public deleteClub: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const clubId = parseInt(req.params.clubId, 10);

      if (!clubId) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

      await new ClubService().deleteClub(clubId);

      res.status(StatusCodes.NO_CONTENT).json({ code: StatusCodes.NO_CONTENT });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
