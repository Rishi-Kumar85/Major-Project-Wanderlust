const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveReturnTo } = require("../middleware.js");

const userController = require("../controllers/users.js");

router 
  .route("/signup")
// GET /users/signup
   .get(userController.renderSignupForm)
// POST /users/signup
  .post(wrapAsync(userController.Signup));


router
  .route("/login")
// GET /users/login
  .get(userController.renderLoginForm )
// POST /users/login
  .post(
  saveReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login"
  }),userController.Login);

  
// GET /users/logout
router.get("/logout",userController.Logout);

module.exports = router;