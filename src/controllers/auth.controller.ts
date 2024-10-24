import { RequestHandler } from "express";
import AuthService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";

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
}
