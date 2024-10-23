import { DataTypes, Model, Sequelize } from "sequelize";
import { ApiError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import User from "./user.model";
import Category from "./category.model";

export default class Club extends Model<IClub> {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        _id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        contact: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        applyUrl: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        thumbnail: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        sns: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        logo: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        detail: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        recruitPeriod: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isRecruiting: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "club",
        tableName: "clubs",
        charset: "utf8",
        collate: "utf8_unicode_ci",
        paranoid: true,
        timestamps: true,
        validate: {
          isRecruitingWithNoPeriod() {
            if (this.isRecruiting && this.recruitPeriod === null) {
              throw new ApiError(
                "'recruitPeriod' is require when 'isRecruiting' is 'true'.",
                StatusCodes.BAD_REQUEST,
              );
            }
          },
        },
      },
    );
  }

  static associate() {
    super.hasOne(User, {
      as: "club",
      foreignKey: { name: "clubId", allowNull: true },
      sourceKey: "_id",
    });

    super.belongsTo(Category, {
      as: "category",
      foreignKey: { name: "categoryId", allowNull: false },
      targetKey: "_id",
    });
  }
}
