import Category from "../models/category.model";

export default class CategoryService {
  public async allCategories() {
    const result = await Category.findAndCountAll({
      where: { deletedAt: null },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });

    return result;
  }
}
