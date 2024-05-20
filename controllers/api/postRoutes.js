const router = require("express").Router();
const { Posts } = require("../../models");
const logger = require("../../utils/logger");
const fs = require('fs').promises;
const sequelize = require('../../config/connection');

// Route to create a new post
router.post("/", async (req, res) => {
  try {
    const postData = await Posts.create(req.body);
    res.status(200).json(postData);
  } catch (err) {
    logger.error(err);
    res.status(400).json(err);
  }
});

// Route to delete a post by id
router.delete("/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const post = await Posts.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.userId,
      },
      transaction,
    });

    if (!post) {
      await transaction.rollback();
      return res.status(404).json({ message: "No post found with this id!" });
    }

    await post.destroy({ transaction });

    const filePath = `././public/${post.source}`;
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      logger.info(`File deleted successfully: ${filePath}`);
    } catch (fileError) {
      if (fileError.code === "ENOENT") {
        logger.warn(`File not found, nothing to delete: ${filePath}`);
      } else {
        logger.error(`Error deleting file: ${filePath}`, fileError);
        throw fileError;
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Post and file deleted successfully" });
  } catch (err) {
    await transaction.rollback();
    logger.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
