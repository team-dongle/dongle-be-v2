import jwt from "jsonwebtoken";
import { env } from "../utils/env";
import User from "../models/user.model";

export default class JwtService {
  static sign(payload: JwtPayload) {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expires,
      algorithm: "HS256",
    });
  }

  static verify(token: string) {
    let decoded = null;

    try {
      decoded = jwt.verify(token, env.jwt.secret);
      return { ok: true, result: decoded };
    } catch (e: any) {
      return {
        ok: false,
        message: e.name === "TokenExpiredError" ? "Token Expired" : e.message,
      };
    }
  }

  static refreshSign() {
    return jwt.sign({}, env.jwt.secret, {
      expiresIn: env.jwt.refresh_expires,
      algorithm: "HS256",
    });
  }

  static async refreshVerify(token: string, username: string) {
    try {
      const user = await User.findOne({ where: { username: username } });
      const userRefreshToken = user.dataValues.refreshToken;

      if (token === userRefreshToken) {
        try {
          jwt.verify(token, env.jwt.secret);
          return true;
        } catch {
          return false;
        }
      } else {
        return false;
      }
    } catch (e: any) {
      return false;
    }
  }
}
