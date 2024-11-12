import { RequestHandler } from "express";
import logger from "../utils/logger";
import { s3 } from "../utils/s3bucket";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../utils/env";
import * as fs from "fs";
import stream from "stream";

export default class DownloadController {
  public downloadFile: RequestHandler = async (req, res, next) => {
    try {
      const fileName = req.params.fileName;

      const getFileCommand = new GetObjectCommand({
        Bucket: env.bucket.name,
        Key: `files/${fileName}`,
      });

      const data = await s3.send(getFileCommand);
      const fileBody = await data.Body;

      const readStream = new stream.PassThrough();
      readStream.end(await fileBody.transformToByteArray());

      res.set("Content-disposition", "attachment; filename=" + fileName);
      res.set("Content-Type", "application/octet-stream");

      readStream.pipe(res);
    } catch (e: any) {
      logger.error(`${e}`);
      next(e);
    }
  };
}
