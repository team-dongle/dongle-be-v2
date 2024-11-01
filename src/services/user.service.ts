import { ApiError } from "../utils/error";
import User from "../models/user.model";
import * as Yup from "yup";
import { StatusCodes } from "http-status-codes";
import Club from "../models/club.model";

export default class UserService {
  public async allUsers(page: number, size: number) {
    const result = await User.findAndCountAll({
      limit: size,
      offset: size * (page - 1),
      where: { deletedAt: null },
      include: [{ model: Club, attributes: ["_id", "name"], as: "club" }],
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "refreshToken",
        ],
      },
    });

    return result;
  }

  public async userDetail(username: string) {
    const result = await User.findOne({
      where: { username: username },
      include: [{ model: Club, attributes: ["_id", "name"], as: "club" }],
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "refreshToken",
        ],
      },
    });

    return result;
  }

  public async createUser(payload: {
    username: string;
    password: string;
    role: "CLUB" | "ADMIN";
    name: string;
  }) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
      role: Yup.string().oneOf(["CLUB", "ADMIN"]).required(),
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(payload)))
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const isUserExists = await User.findOne({
      where: { username: payload.username },
    }).then((user) => user !== null);

    if (isUserExists)
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const result = await User.create(payload);

    if (!result) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    return true;
  }

  public async deleteUser(userId: number) {
    const isIdNumber = Yup.number().required();

    if (!(await isIdNumber.isValid(userId)))
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const result = await User.destroy({ where: { _id: userId } });

    if (!result) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    return true;
  }
}
