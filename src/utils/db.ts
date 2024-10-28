import { Sequelize } from "sequelize";
import { env } from "./env";
import logger from "./logger";
import User from "../models/user.model";
import Category from "../models/category.model";
import Club from "../models/club.model";
import Notice from "../models/notice.model";

const sequelize = new Sequelize(
  env.db.schema,
  env.db.username,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
    dialect: "mysql",
    dialectOptions: {},
    pool: {
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+09:00",
    logging: (message: string) => logger.info(message),
  },
);

const initModels = () => {
  User.initialize(sequelize);
  Category.initialize(sequelize);
  Club.initialize(sequelize);
  Notice.initialize(sequelize);
};

const associateModels = () => {
  User.associate();
  Category.associate();
  Club.associate();
  Notice.associate();
};

export const connect = () => {
  initModels();
  associateModels();

  sequelize
    .authenticate()
    .then(() => {
      logger.info("Successfully connected to mysql server.");

      sequelize
        .sync({ alter: process.env.NODE_ENV === "prod" ? false : true })
        .then(() => {
          logger.info("Successfully synchronized models to mysql server.");
        })
        .catch((e: any) => {
          logger.error(`An error occured while Synchronizing models.`);
          logger.error(`Error: ${e}`);
        });
    })
    .catch((e: any) => {
      logger.error(`An error occured while connecting mysql server.`);
      logger.error(`Error: ${e}`);
    });
};
