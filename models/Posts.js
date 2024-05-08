const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Posts extends Model {}

Posts.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    x_coord: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y_coord: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    x_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    board_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "boards",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "posts",
  }
);
/*
DBML
Table posts {
  id int [pk, increment]
  title string [not null]
  content text [not null]
  created_at date [not null]
  x_coord int [not null]
  y_coord int [not null]
  url string
  user_id int [ref: > users.id]
  board_id int [ref: > boards.id]
}
*/
module.exports = Posts;
