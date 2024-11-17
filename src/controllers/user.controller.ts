import { RequestHandler } from "express";
import UserService from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";
import { ApiError } from "../utils/error";

export default class UserController {
  public allUserList: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const result = await new UserService().allUsers();

      res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        result: { ...result },
      });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public userDetail: RequestHandler = async (req, res, next) => {
    try {
      if (!req.username)
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const result = await new UserService().userDetail(req.username);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK, result: result });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };

  public createUser: RequestHandler = async (req, res, next) => {
    try {
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

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
      if (req.role !== "ADMIN")
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

      const userId = parseInt(req.params.userId, 10);

      await new UserService().deleteUser(userId);

      res.status(StatusCodes.OK).json({ code: StatusCodes.OK });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
