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
          type: DataTypes.STRING(20),
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn("NOW"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.fn("NOW"),
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
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
              throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);
            }
          },
        },
      },
    );
  }

  static associate() {
    super.belongsTo(User, {
      as: "owner",
      foreignKey: { name: "ownerId", allowNull: true },
      targetKey: "_id",
      onDelete: "CASCADE",
    });

    super.belongsTo(Category, {
      as: "category",
      foreignKey: { name: "categoryId", allowNull: false },
      targetKey: "_id",
    });
  }
}
