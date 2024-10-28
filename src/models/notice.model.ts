import { DataTypes, Model, Sequelize } from "sequelize";
import User from "./user.model";

export default class Notice extends Model<INotice> {
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
            title: {
                type: DataTypes.STRING(20),
                allowNull: false,
              },
            content: {
                type: DataTypes.TEXT,
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
                modelName: "notice",
                tableName: "notices",
                charset: "utf8",
                collate: "utf8_unicode_ci",
                paranoid: true, 
                timestamps: true,   
            }
        );
  }
  
  static associate() {
    super.belongsTo(User, {
      as: "author",
      foreignKey: { name: "authorId", allowNull: false },
      targetKey: "_id",
    });
  }  
}  


