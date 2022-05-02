const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

module.exports = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "tag",
  }
);
