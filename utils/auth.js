const withAuth = (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    return next();
  }
  
  if (!req.session.userId) {
    console.log("nogo");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;
