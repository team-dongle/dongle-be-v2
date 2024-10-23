import dotenv from "dotenv";
import path from "path";
import appRoot from "app-root-path";

dotenv.config({
  path: path.join(appRoot.path, `.env.${process.env.NODE_ENV}`),
});

export const env = {
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    cors: process.env.APP_CORS.split(",") || [],
  },
  db: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    schema: process.env.MYSQL_SCHEMA,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
  },
};
