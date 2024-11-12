import { RequestHandler } from "express";
import path from "path";
import { env } from "../utils/env";
import { ApiError } from "../utils/error";
import { StatusCodes } from "http-status-codes";

export default class UploadController {
  public uploadClubLogo: RequestHandler = (req, res, next) => {
    const logoImage = req.file as Express.MulterS3.File;

    if (
      !logoImage ||
      !env.bucket.allow_exts_img.includes(path.extname(logoImage.originalname))
    )
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    res
      .status(StatusCodes.CREATED)
      .json({ code: StatusCodes.CREATED, result: { url: logoImage.location } });
  };

  public uploadAttachment: RequestHandler = (req, res, next) => {
    const file = req.file as Express.MulterS3.File;

    if (
      !file ||
      !env.bucket.allow_exts_file.includes(path.extname(file.originalname))
    )
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    res
      .status(StatusCodes.CREATED)
      .json({
        code: StatusCodes.CREATED,
        result: { filename: file.originalname, url: file.location },
      });
  };
}
