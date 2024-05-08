const Boards = require("./Boards");
const Posts = require("./Posts");
const Users = require("./Users");

Users.hasMany(Posts, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Posts.belongsTo(Users, {
  foreignKey: "user_id",
});

Boards.hasMany(Posts, {
  foreignKey: "board_id",
  onDelete: "CASCADE",
});

Posts.belongsTo(Boards, {
  foreignKey: "board_id",
});

module.exports = { Boards, Posts, Users };
