import morgan from "morgan";
import logger from "./logger";

const format = process.env.NODE_ENV === "prod" ? "combined" : "dev";

const stream = {
  write: (message: string) =>
    logger.info(
      message.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
        "",
      ),
    ),
};

const skip = (_, res) => {
  if (process.env.NODE_ENV === "prod") {
    return res.statusCode < 400;
  }

  return false;
};

export const morganMiddleware = morgan(format, { stream, skip });
