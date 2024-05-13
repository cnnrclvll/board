const router = require("express").Router();
const { Users } = require("../../models");

// /api/user
router.post("/", async (req, res) => {
  try {
    console.log("Received POST request to create a new user");
    console.log("Request body:", req.body);

    const userData = await Users.create(req.body);

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("Received POST request to login");
    console.log("Request body:", req.body);
    const userData = await Users.findOne({ where: { user_name: req.body.user } });
    console.log("User data:", userData);
    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
