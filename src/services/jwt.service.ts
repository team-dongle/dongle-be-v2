import jwt from "jsonwebtoken";
import { env } from "../utils/env";

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
      return decoded;
    } catch (e: any) {
      return null;
    }
  }
}
