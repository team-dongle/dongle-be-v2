import multer from "multer";
import multerS3 from "multer-s3";
import { env } from "./env";
import { v4 } from "uuid";
import { s3 } from "./s3bucket";
import path from "path";
import { ApiError } from "./error";
import { StatusCodes } from "http-status-codes";

const upload = (filePath: string, exts: string[], maxFileSize: number) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: env.bucket.name,
      key: (req, file, cb) => {
        const fileExt = path.extname(file.originalname)
        const baseName = path.basename(file.originalname, path.extname(file.originalname))
        const encoded = Buffer.from(baseName, "latin1").toString("utf8")
        cb(null, `${filePath}/${encoded}__${v4()}${fileExt}`);
      },
      acl: "public-read",
    }),
    fileFilter: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      if (!exts.includes(fileExt)) {
        return cb(new ApiError("Bad Request", StatusCodes.BAD_REQUEST));
      }

      cb(null, true);
    },
    limits: { fileSize: maxFileSize * 1024 * 1024 },
  });

export { upload };
