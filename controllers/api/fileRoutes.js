const router = require("express").Router();
const fileUpload = require("express-fileupload");
const fs = require("fs").promises;
const sharp = require("sharp");
const withAuth = require("../../utils/auth");
const logger = require("../../utils/logger");

router.use(fileUpload());

const maxWidth = 800;
const maxHeight = 800;

// Route to upload a file
router.post("/upload", withAuth, async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.files.image) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Process the uploaded image
    const file = req.files.image;
    const inputBuffer = file.data;
    const fileType = file.mimetype.split("/")[1];
    let resizedImage;
    if (fileType == "gif") {
      resizedImage = await sharp(inputBuffer, { animated: true })
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: "inside",
          withoutEnlargement: true,
        })
        .gif({ dither: 0 })
        .toBuffer();
    } else {
      resizedImage = await sharp(inputBuffer)
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();
    }

    // Generate unique filename
    const filename = `${req.session.userId}-${Date.now()}.${fileType}`;

    // Save the resized image
    await fs.writeFile(`./public/uploads/${filename}`, resizedImage);

    // Send success response with file URL
    res.status(200).json({ url: `/uploads/${filename}` });
  } catch (err) {
    // Handle errors and send error response
    console.log(req.session.userId);
    logger.error(err);
    console.log(err)
    res.status(500).json(err);
  }
});

// Route to delete a file
router.delete("/delete/:filename", withAuth, async (req, res) => {
  try {
    // Check if file exists
    await fs.access(`./public/uploads/${req.params.filename}`);

    // Delete the file
    await fs.unlink(`./public/uploads/${req.params.filename}`);

    // Send success response
    res.status(200).json({ message: "File deleted" });
  } catch (err) {
    // Handle errors and send error response
    if (err.code === "ENOENT") {
      logger.error(err);
      return res.status(404).json({ message: "File not found" });
    }

    logger.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
