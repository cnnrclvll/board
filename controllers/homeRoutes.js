const router = require("express").Router();
const { Boards, Posts, Users, Comments } = require("../models");
const withAuth = require("../utils/auth");

// TODO: figure out home route
router.get("/", async (req, res) => {});

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
                    ],
                },
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
        };

        res.render("login");
    } catch (err) {
        res.status(500).json(err);
    };
});

// search boards by tags
router.get("/search", async (req, res) => {
    try {
        const tags = req.query.tags.split(",");
        console.log(tags);

        const boards = await Boards.findAll({
            include: [
                {
                    model: Tags,
                    where: {
                        tag_name: tags,
                    },
                },
            ],
        });
            
        const boardData = boards.map((board) => board.get({ plain: true }));

        res.render("search", {
            boardData,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});