const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Boards extends Model {}

Boards.init(
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
      unique: true,
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
    modelName: "boards",
  }
);

/* DBML
Table boards {
  id int [pk, increment]
  title string [not null, unique]
  created_at date [not null]
}

*/

module.exports = Boards;