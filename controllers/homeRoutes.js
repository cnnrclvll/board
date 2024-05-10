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
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
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
      group: ["boards.id"],
      order: [[sequelize.literal("post_count"), "DESC"]],
    });

    const boardData = boards.map((board) => board.get({ plain: true }));

    res.render("search", {
      boardData,
      logged_in: req.session.logged_in,
    });


    // const tags = req.query.tags.split(",");
    // console.log(tags);

    // const boards = await Boards.findAll({
    //   include: [
    //     {
    //       model: Tags,
    //       where: {
    //         tag_name: tags,
    //       },
    //     },
    //   ],
    // });

    // const boardData = boards.map((board) => board.get({ plain: true }));

    // res.render("search", {
    //   boardData,
    //   logged_in: req.session.logged_in,
    // });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
