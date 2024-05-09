const Boards = require("./Boards");
const Posts = require("./Posts");
const Users = require("./Users");
const Tags = require("./Tags");
const BoardTags = require("./BoardTags");

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

Boards.belongsToMany(Tags, {
  through: BoardTags,
  foreignKey: "board_id",
});

Tags.belongsToMany(Boards, {
  through: BoardTags,
  foreignKey: "tag_id",
});

module.exports = { Boards, Posts, Users, Tags };
