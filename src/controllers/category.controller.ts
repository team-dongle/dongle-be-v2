import { RequestHandler } from "express";
import CategoryService from "../services/category.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger";

export default class CategoryController {
  public allCategories: RequestHandler = async (req, res, next) => {
    try {
      const result = await new CategoryService().allCategories();

      res
        .status(StatusCodes.OK)
        .json({ code: StatusCodes.OK, result: { ...result } });
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
