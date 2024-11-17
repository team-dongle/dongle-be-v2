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
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES,
    refresh_expires: process.env.JWT_REFRESH_EXPIRES,
  },
  bucket: {
    name: process.env.BUCKET_NAME,
    endpoint: process.env.BUCKET_API_ENDPOINT,
    secret: process.env.BUCKET_SECRET_KEY,
    accessKey: process.env.BUCKET_ACCESS_KEY,
    userid: process.env.BUCKET_USERID,
    allow_exts_img: process.env.BUCKET_ALLOW_EXTS_IMAGE.split(",") || [],
    allow_exts_file: process.env.BUCKET_ALLOW_EXTS_FILE.split(",") || [],
  },
};
