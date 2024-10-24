import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import { ApiError } from "../utils/error";
import * as Yup from "yup";
import JwtService from "./jwt.service";
import bcrypt from "bcryptjs";

export default class AuthService {
  public async login(username: string, password: string) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid({ username, password })))
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    const user = await User.findOne({ where: { username: username } });

    if (!user) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    if (!(await bcrypt.compare(password, user.dataValues.password)))
      throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const token = JwtService.sign({
      username: user.dataValues.username,
      role: user.dataValues.role,
    });

    return { token };
  }
}
