import { RequestHandler } from "express";
import UserService from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";

export default class UserController {
  public allUserList: RequestHandler = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const size = parseInt(req.query.size as string, 10) || 5;

      const result = await new UserService().allUsers(page, size);

      res
        .status(StatusCodes.OK)
        .json({ code: StatusCodes.OK, result: { ...result } });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public createUser: RequestHandler = async (req, res, next) => {
    try {
      const { username, password, role, name } = req.body;

      await new UserService().createUser({
        username,
        password,
        role,
        name,
      });

      res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public deleteUser: RequestHandler = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId, 10);

      await new UserService().deleteUser(userId);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
