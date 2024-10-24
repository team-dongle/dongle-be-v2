import User from "../models/user.model";
import Category from "../models/category.model";
import Club from "../models/club.model";

export default class ClubService {
  public async allClubs() {
    const result = await Club.findAndCountAll({
      where: { deletedAt: null },
      include: [
        {
          model: Category,
          attributes: ["name"],
          as: "category",
        },
        {
          model: User,
          attributes: ["name"],
          as: "owner",
        },
      ],
      attributes: { exclude: ["detail", "ownerId", "categoryId"] },
    });

    return result;
  }
}
