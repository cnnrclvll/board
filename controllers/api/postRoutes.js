const router = require("express").Router();
const { Posts } = require("../../models");

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.session.userId);
    const postData = await Posts.create(req.body, user_id = req.session.userId);

    res.status(200).json(postData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const postData = await Posts.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.userId,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
