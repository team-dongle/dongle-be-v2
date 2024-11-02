import { RequestHandler } from "express";
import JwtService from "../services/jwt.service";
import { ApiError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import logger from "../utils/logger";
import Club from "../models/club.model";

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    if (!req.headers.authorization)
      throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const token = req.headers.authorization.split("Bearer ")[1] || "";
    const decoded = JwtService.verify(token);

    if (!decoded.ok)
      throw new ApiError(decoded.message, StatusCodes.UNAUTHORIZED);

    if (!decoded.result.username)
      throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const user = await User.findOne({
      where: { username: decoded.result.username },
    });

    if (!user) throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const clubId = await Club.findOne({
      where: { ownerId: user.dataValues._id },
    }).then((club) => {
      if (!club) return null;
      return club.dataValues._id;
    });

    console.log(clubId);

    req.username = user.dataValues.username;
    req.role = user.dataValues.role;
    req.club = clubId;
    next();
  } catch (e: any) {
    logger.error(`${e}`);
    next(e);
  }
};
