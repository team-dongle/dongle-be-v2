import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import { ApiError } from "../utils/error";
import * as Yup from "yup";
import JwtService from "./jwt.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    const accessToken = JwtService.sign({
      username: user.dataValues.username,
      role: user.dataValues.role,
    });
    const refreshToken = JwtService.refreshSign();

    await User.update(
      { refreshToken: refreshToken },
      { where: { username: username } },
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      role: user.dataValues.role,
    };
  }

  public async refresh(accessToken: string, refreshToken: string) {
    if (!accessToken || !refreshToken)
      throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);

    const verifyAccessToken = JwtService.verify(accessToken);
    const decodedAccessToken = jwt.decode(accessToken) as {
      username: string;
      role: string;
    };

    console.log(decodedAccessToken);
    const verifyRefreshToken = JwtService.refreshVerify(
      refreshToken,
      decodedAccessToken.username,
    );

    console.log(verifyAccessToken, await verifyRefreshToken);

    if (
      verifyAccessToken.ok === false &&
      verifyAccessToken.message === "Token Expired"
    ) {
      if ((await verifyRefreshToken) === false) {
        throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED);
      } else {
        const newAccessToken = JwtService.sign({
          username: decodedAccessToken.username,
          role: decodedAccessToken.role,
        });

        return { accessToken: newAccessToken, refreshToken: refreshToken };
      }
    } else {
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);
    }
  }
}
