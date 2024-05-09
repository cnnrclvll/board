const router = require("express").Router();
const fileUpload = require("express-fileupload");
const fs = require("fs").promises;
const sharp = require("sharp");
const withAuth = require("../../utils/auth");

router.use(fileUpload());

const maxWidth = 800;
const maxHeight = 800;

router.post("/upload", withAuth, async (req, res) => {
    try {
        if (!req.files.image) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.image;

        const inputBuffer = file.data;

        const resizedImage = await sharp(inputBuffer)
            .resize({
                width: maxWidth,
                height: maxHeight,
                fit: "inside",
                withoutEnlargement: true,
            })
            .toBuffer();

        const filename = `${req.session.userId}-${Date.now()}.jpg`;

        await fs.writeFile(`./public/uploads/${filename}`, resizedImage);

        res.status(200).json({ url: `/uploads/${filename}` });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/delete/:filename", withAuth, async (req, res) => {
    try {
        await fs.access(`./public/uploads/${req.params.filename}`);

        await fs.unlink(`./public/uploads/${req.params.filename}`);

        res.status(200).json({ message: "File deleted" });
    } catch (err) {
        if (err.code === "ENOENT") {
            return res.status(404).json({ message: "File not found" });
        }
        
        res.status(500).json(err);
    }
});