import User from "../models/user.model";
import Category from "../models/category.model";
import Club from "../models/club.model";
import * as Yup from "yup";
import { ApiError } from "../utils/error";
import { StatusCodes } from "http-status-codes";

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
      attributes: {
        exclude: [
          "detail",
          "ownerId",
          "categoryId",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      },
    });

    return result;
  }

  public async clubDetail(clubId: number) {
    const result = await Club.findOne({
      where: { _id: clubId },
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
      attributes: {
        exclude: [
          "ownerId",
          "categoryId",
          "createdAt",
          "updatedAt",
          "deletedAt",
        ],
      },
    });

    return result;
  }

  public async createClub(payload: Exclude<IClub, "_id">) {
    const schema = Yup.object({}).shape({
      name: Yup.string().required(),
      contact: Yup.string().required(),
      location: Yup.string().required(),
      applyUrl: Yup.string().required(),
      thumbnail: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      sns: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      logo: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      detail: Yup.string().required(),
      recruitPeriod: Yup.string().optional(),
      isRecruiting: Yup.boolean().required(),
      categoryId: Yup.number().required(),
      ownerId: Yup.string().required(),
    });

    const owner = await User.findOne({ where: { username: payload.ownerId } });

    if (!owner) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    if (!(await schema.isValid(payload)))
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const isClubExists = await Club.findOne({
      where: { name: payload.name },
    }).then((club) => club !== null);

    if (isClubExists)
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const isOwnerHasClub = await Club.findOne({
      where: { ownerId: owner.dataValues._id },
    }).then((club) => club !== null);

    if (isOwnerHasClub)
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const result = await Club.create({
      ...payload,
      ownerId: owner.dataValues._id,
    });

    if (!result) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    return true;
  }

  public async updateClub(clubId: number, payload: Partial<IClub>) {
    const schema = Yup.object().shape({
      contact: Yup.string().optional(),
      location: Yup.string().optional(),
      applyUrl: Yup.string().optional(),
      thumbnail: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      sns: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      logo: Yup.lazy((value: string) =>
        value === "" ? Yup.string() : Yup.string().optional(),
      ),
      detail: Yup.string().optional(),
      recruitPeriod: Yup.string().optional(),
      isRecruiting: Yup.boolean().required(),
    });

    if (!(await schema.isValid(payload)))
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const isClubExists = Club.findOne({ where: { _id: clubId } }).then(
      (club) => club !== null,
    );

    if (!isClubExists)
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    await Club.update({ ...payload }, { where: { _id: clubId } });

    return true;
  }

  public async deleteClub(clubId: number) {
    const isClubExists = Club.findOne({ where: { _id: clubId } }).then(
      (club) => club !== null,
    );

    if (!isClubExists)
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    await Club.destroy({ where: { _id: clubId } });

    return true;
  }
}
