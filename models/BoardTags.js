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

/* DBML
Table board_tags {
  id int [pk, increment]
  board_id int [ref: > boards.id]
  tag_id int [ref: > tags.id]
}
*/
module.exports = BoardTags;