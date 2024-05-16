const router = require("express").Router();
const { Boards, Tags, Posts, Users } = require("../../models");
const withAuth = require("../../utils/auth");

/* DBML
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
    tag
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "boards",
  }
);

Tags.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "tags",
  }
);

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
*/

/*
{
    title: "My first board",
    tags: ["tag1", "tag2", "tag3"],
}
*/

// get board by id with tags and posts
router.get("/:id", async (req, res) => {
  try {
    const boardId = req.params.id;

    // Fetch the board with its associated posts and tags
    const boardData = await Boards.findByPk(boardId, {
      include: [
        {
          model: Tags,
          attributes: ["tag_name"],
        },
        {
          model: Posts, // Include the Posts model
          include: [
            {
              model: Users,
              attributes: ["user_name"],
            },
          ],
        },
      ],
    });

    if (!boardData) {
      // Handle the case where the board with the given id is not found
      return res.status(404).json({ message: "Board not found" });
    }

    // Get the plain JavaScript object representation of the board
    const board = boardData.get({ plain: true });

    // Send the board data in the response
    res.status(200).json(board);
  } catch (err) {
    // Handle any errors that occur during the database query or processing
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/", withAuth, async (req, res) => {
  try {
    const boardData = await Boards.create(req.body);

    if (req.body.tags.length) {
      const tags = await Promise.all(
        req.body.tags.map(async (tagName) => {
          const [tag] = await Tags.findOrCreate({
            where: { tag_name: tagName },
          });
          return tag;
        })
      );
      await boardData.setTags(tags);
    }

    res.status(201).json(boardData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
