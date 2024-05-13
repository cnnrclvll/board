const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class BoardTags extends Model {}

BoardTags.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "boards",
        key: "id",
      },
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tags",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "board_tags",
  }
);

module.exports = BoardTags;
