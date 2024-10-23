import express from "express";
import { env } from "./utils/env";
import { morganMiddleware } from "./utils/morgan";
import logger from "./utils/logger";
import cors from "cors";
import { connect } from "./utils/db";
import { StatusCodes } from "http-status-codes";
import * as v1 from "./routes/v1/v1.route";

const app = express();

app.use(morganMiddleware);
app.use(cors({ origin: env.app.cors, credentials: true }));

app.get("/healthCheck", (_req, res) => {
  res.status(StatusCodes.OK).json({ statusCode: StatusCodes.OK });
});

app.use(v1.path, v1.router);

app.listen(env.app.port, () => {
  connect();

  logger.info(`Server is listening on PORT ${env.app.port}`);
  logger.info(`CORS Origins: ${env.app.cors}`);
});
