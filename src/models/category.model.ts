import { DataTypes, Model, Sequelize } from "sequelize";
import Club from "./club.model";

export default class Category extends Model<ICategory> {
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
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING(10),
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
        modelName: "category",
        tableName: "categories",
        charset: "utf8",
        collate: "utf8_unicode_ci",
        paranoid: true,
        timestamps: true,
      },
    );
  }

  static associate() {
    super.hasMany(Club, {
      as: "category",
      foreignKey: { name: "categoryId", allowNull: false },
      sourceKey: "_id",
    });
  }
}
