const router = require("express").Router();
const { Posts } = require("../../models");
const logger = require("../../utils/logger");

// Route to create a new post
router.post("/", async (req, res) => {
  try {

    // Create a new post
    const postData = await Posts.create(req.body);

    // Send the created post data in the response
    res.status(200).json(postData);
  } catch (err) {
    // Handle errors and send error response
    logger.error(err);
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {

// Route to delete a post by id
    const postData = await Posts.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.userId,
      },
    });

    // If no post found with the specified id, send a 404 response
    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    // Send a success response after deleting the post
    res.status(200).json(postData);
  } catch (err) {
    // Handle errors and send error response
    logger.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
