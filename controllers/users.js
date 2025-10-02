const User = require("../models/user.js");



// Functionality of all users route

// Render form for signup
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// Post details of signup
module.exports.Signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash("error", "Email already registered. Try logging in.");
      return res.redirect("/users/signup");
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      req.flash("error", "Username already taken. Please choose another.");
      return res.redirect("/users/signup");
    }
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/users/signup");
  }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// Post login details
module.exports.Login = async (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(res.locals.returnTo || "/listings");
  };

// Logout routes
module.exports.Logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};