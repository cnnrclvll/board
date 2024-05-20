const router = require("express").Router();
const { Boards, Tags, Posts, Users } = require("../../models");
const withAuth = require("../../utils/auth");
const logger = require("../../utils/logger");

// Route to get board by id with tags and posts
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

    // If no board found, return 404
    if (!boardData) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Get the plain JavaScript object representation of the board
    const board = boardData.get({ plain: true });

    // Send the board data in the response
    res.status(200).json(board);
  } catch (err) {
    // Handle any errors that occur during the database query or processing
    logger.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to create a new board
router.post("/", withAuth, async (req, res) => {
  try {
    // Create a new board
    const boardData = await Boards.create(req.body);

    // If board has tags, associate them
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

    // Send success response with created board data
    res.status(201).json(boardData);
  } catch (err) {
    // Handle errors and send error response
    logger.error(err);
    res.status(400).json(err);
  }
});

module.exports = router;
