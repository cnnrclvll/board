const router = require("express").Router();
const sequelize = require("../config/connection");
const { Boards, Posts, Users, Tags } = require("../models");
const withAuth = require("../utils/auth");
const logger = require("../utils/logger"); // Add logging utility

router.get("/", async (req, res) => {
  try {
    const boards = await Boards.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM posts WHERE posts.board_id = boards.id)"
            ),
            "post_count",
          ],
        ],
      },
      include: [
        {
          model: Posts,
          attributes: [],
        },
        {
          model: Tags,
          attributes: ["tag_name"],
        },
      ],
      group: ["boards.id", "tags.id"],
      order: [[sequelize.literal("post_count"), "DESC"]],
    });
    // send 5 most popular boards
    const boardData = boards
      .slice(0, 4)
      .map((board) => board.get({ plain: true }));

    res.render("homepage", {
      boardData,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

// get a single board
router.get("/board/:id", async (req, res) => {
  try {
    const boardData = await Boards.findByPk(req.params.id, {
      include: [
        {
          model: Posts,
          include: [
            {
              model: Users,
              attributes: ["user_name"],
            },
          ],
        },
        {
          model: Tags,
          attributes: ["tag_name"],
        },
      ],
    });

    if (!boardData) {
      logger.warn(`Board with id ${req.params.id} not found`); // Log warning
      res.status(404).render("error", { message: "Board not found" });
      return;
    }

    const board = boardData.get({ plain: true });

    logger.info(`Board with id ${req.params.id} retrieved successfully`); // Log info

    res.render("board", {
      board,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

// create board
router.get("/create-board", withAuth, async (req, res) => {
  try {
    res.render("createBoard", {
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

// login route
router.get("/login", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/");
      return;
    }

    res.render("login");
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

// search boards by tags sorted by number of posts
router.get("/search", async (req, res) => {
  try {
    const tags = req.query.tags.split(",");
    const boards = await Boards.findAll({
      include: [
        {
          model: Tags,
          where: {
            tag_name: tags,
          },
          required: true, // Ensure that at least one matching tag is required
        },
        {
          model: Posts,
          attributes: [],
        },
      ],
      separate: true, // Fetch Tags separately
      order: [
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM posts WHERE posts.board_id = boards.id)"
          ),
          "DESC",
        ],
      ],
    });

    // Fetch all tags associated with each board
    for (const board of boards) {
      const allTags = await board.getTags();
      board.dataValues.allTags = allTags.map((tag) => tag.get({ plain: true }));
    }

    const boardData = boards.map((board) => board.get({ plain: true }));

    logger.info("Search results retrieved successfully"); // Log info
    for (const board of boardData) {
      logger.debug(board.id);
      logger.debug(board.title);
      for (const tag of board.allTags) {
        logger.debug(tag.tag_name);
      }
    }
    res.render("searchpage", {
      boardData,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res
      .status(500)
      .render("error", { message: "Failed to retrieve search results" });
  }
});

router.get("/board/:id/create-post", async (req, res) => {
  try {
    res.render("createPost", {
      board_id: req.params.id,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.session.userId, {
      include: [
        {
          model: Posts,
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });
    const user = userData.get({ plain: true });
    res.render("profile", {
      user,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    logger.error(err); // Log error
    res.status(500).render("error", { message: "Internal server error" });
  }
});

router.get("*", (req, res) => {
  res.status(404).render("error", { message: "Page not found" });
});

module.exports = router;
