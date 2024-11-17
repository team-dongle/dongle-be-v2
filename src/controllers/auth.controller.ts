import { RequestHandler } from "express";
import AuthService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";
import { ApiError } from "../utils/error";

export default class AuthController {
  public login: RequestHandler = async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const result = await new AuthService().login(username, password);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result: result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public refresh: RequestHandler = async (req, res, next) => {
    try {
      if (!req.headers.authorization)
        throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

      const accessToken = req.headers.authorization.split("Bearer ")[1] || "";
      const refreshToken = req.headers.refresh as string;

      const result = await new AuthService().refresh(accessToken, refreshToken);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result: result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
