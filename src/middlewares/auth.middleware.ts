import { RequestHandler } from "express";
import JwtService from "../services/jwt.service";
import { ApiError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import logger from "../utils/logger";

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.headers.authorization)
      throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const token = req.headers.authorization.split("Bearer ")[1] || "";
    const decoded = JwtService.verify(token);

    if (!decoded) throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const user = await User.findOne({ where: { username: decoded.username } });

    if (!user) throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    req.username = user.dataValues.username;
    req.role = user.dataValues.role;
    req.club = user.dataValues.club;
    next();
  } catch (e: any) {
    logger.error(`${e}`);
    next(e);
  }
};
