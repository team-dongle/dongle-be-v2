import { Router } from "express";
import CategoryController from "../../controllers/category.controller";

export const router = Router();
export const path = "/categories";

router.get("/", new CategoryController().allCategories);
