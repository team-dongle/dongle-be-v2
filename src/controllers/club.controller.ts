import { RequestHandler } from "express";
import ClubService from "../services/club.service";
import logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";

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
}
