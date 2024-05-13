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
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single board
router.get("/board/:id", async (req, res) => {
  try {
    boardData = await Boards.findByPk(req.params.id, {
      include: [
        {
          model: Posts,
          include: [
            {
              model: Users,
              attributes: ["username"],
            },
            {
              model: Tags,
              attributes: ["tag_name"],
            },
          ],
        },
        {},
      ],
    });

    const board = boardData.get({ plain: true });

    console.log(board);

    res.render("board", {
      board,
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
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
      logged_in: req.session.loggedIn,
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
      logged_in: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
