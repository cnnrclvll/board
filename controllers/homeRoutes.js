const router = require("express").Router();
const sequelize = require("../config/connection");
const { Boards, Posts, Users, Tags } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const boards = await Boards.findAll({
      attributes: {
        include: [
          [sequelize.literal("(SELECT COUNT(*) FROM posts WHERE posts.board_id = boards.id)"), "post_count"],
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
        }
      ],
      group: ["boards.id", "tags.id"],
      order: [[sequelize.literal("post_count"), "DESC"]],
    });
    // send 5 most popular boards
    const boardData = boards.slice(0, 5).map((board) => board.get({ plain: true }));

    res.render("homepage", {
      boardData,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single board
router.get("/board/:id", async (req, res) => {
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
    res.render("board", {
      board,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    // Handle any errors that occur during the database query or processing
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login route
router.get("/login", async (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect("/");
      return;
    }

    res.render("login");
  } catch (err) {
    res.status(500).json(err);
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
        },
        {
          model: Posts,
          attributes: [],
        },
      ],
      group: ["boards.id", "tags.id"],
      order: [[sequelize.literal("(SELECT COUNT(*) FROM posts WHERE posts.board_id = boards.id)"), "DESC"]], // Use sequelize.literal() for ordering
    });

    const boardData = boards.map((board) => board.get({ plain: true }));


    console.log(boardData);
    res.render("search", {
      boardData,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await Users.findByPk(req.session.user_id, {
      include: [
        {
          model: Posts
        },
      ],
    });

    const user = userData.get({ plain: true });

    console.log(user);

    res.render("profile", {
      user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Posts.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: ["user_name"],
        }
      ],
    });

    const post = postData.get({ plain: true });

    res.render("post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
