const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

module.exports = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "category",
  }
);
