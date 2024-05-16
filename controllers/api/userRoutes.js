const router = require("express").Router();
const { Users } = require("../../models");
const logger = require("../../utils/logger");

// Route to create a new user
router.post("/", async (req, res) => {
  try {
    // Log information about the request
    logger.info("Received POST request to create a new user");
    logger.debug("Request body:", req.body);

    // Create a new user
    const userData = await Users.create(req.body);

    // Save user session
    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      // Send response with user data
      res.status(200).json(userData);
    });
  } catch (err) {
    // Handle errors and send error response
    logger.error("Error:", err);
    res.status(400).json(err);
  }
});

// Route to login
router.post("/login", async (req, res) => {
  try {
    // Log information about the request
    logger.info("Received POST request to login");
    logger.debug("Request body:", req.body);
    
    // Find user by username
    const userData = await Users.findOne({ where: { user_name: req.body.user } });
    logger.debug("User data:", userData);
    
    // If user not found, return error
    if (!userData) {
      res.status(400).json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Check if password is valid
    const validPassword = await userData.checkPassword(req.body.password);

    // If password is invalid, return error
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect email or password, please try again" });
      return;
    }

    // Save user session
    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      // Send response with user data and success message
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    // Handle errors and send error response
    logger.error("Error:", err);
    res.status(400).json(err);
  }
});

// Route to logout
router.post("/logout", (req, res) => {
  // If user is logged in, destroy session
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    // If user is not logged in, return 404
    res.status(404).end();
  }
});

module.exports = router;
