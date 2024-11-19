import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import MySQLTransport from "winston-mysql";
import expressWinston from "express-winston";
import { env } from "./env";

const { combine, timestamp, label, printf, colorize, simple } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${label}] ${level}: ${message}`,
);

const loggerDBConfig = {
  host: env.db.host,
  user: env.db.username,
  password: env.db.password,
  database: env.db.schema,
  table: env.db.loggingTable,
};

const mysqlTransports = new MySQLTransport(loggerDBConfig);

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: "dongle-be" }),
    logFormat,
  ),
  transports: [
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: "%DATE%.log",
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/errors`,
      filename: "%DATE%.error.log",
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: "%DATE%.exception.log",
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

const expressWinstonMiddleware = expressWinston.logger({
  level: function (req, res) {
    return res.statusCode < 400 ? "info" : "error";
  },
  transports: [mysqlTransports],
  meta: true,
  msg: function (req, res) {
    return `${req.ip} - HTTP ${res.statusCode} ${req.method} ${req.url}`;
  },
  colorize: false,
});

if (process.env.NODE_ENV !== "prod") {
  logger.add(
    new winston.transports.Console({ format: combine(colorize(), simple()) }),
  );
}

export { expressWinstonMiddleware };
export default logger;
