import { DataTypes, Model, Sequelize } from "sequelize";
import Club from "./club.model";
import bcrypt from "bcryptjs";

export default class User extends Model<IUser> {
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
        username: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        role: {
          type: DataTypes.TINYINT,
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
        modelName: "user",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_unicode_ci",
        paranoid: true,
        timestamps: true,
      },
    );

    super.addHook("beforeSave", async (user: Model<IUser>) => {
      if (user.dataValues.password) {
        const salt = await bcrypt.genSalt(10);
        user.setDataValue(
          "password",
          await bcrypt.hash(user.dataValues.password, salt),
        );
      }
    });
  }

  static associate() {
    super.belongsTo(Club, {
      as: "club",
      foreignKey: { name: "clubId", allowNull: true },
      targetKey: "_id",
    });
  }
}
