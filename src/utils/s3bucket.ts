import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

const s3 = new S3Client({
  credentials: {
    accessKeyId: env.bucket.accessKey,
    secretAccessKey: env.bucket.secret,
  },
  endpoint: env.bucket.endpoint,
  region: "default",
});

export { s3 };
