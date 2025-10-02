// ==============================
// Core Modules & Setup
// ==============================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;


// Path module
const path = require("path");

// ==============================
// Environment Variables
// ==============================
if (process.env.NODE_ENV !== "production") { // If not in production, load environment variables from .env file
  require("dotenv").config();
};

// ==============================
// Passport Authentication
// ==============================
const passport = require("passport");
// Require passport-local strategy
const LocalStrategy = require("passport-local");
// Require User model
const User = require("./models/user.js");

// ==============================
// EJS-Mate for layouts
// ==============================
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// Setting up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// ==============================
// Serving static files from the "public" directory
// ==============================
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

// ==============================
// Middleware to parse request bodies
// ==============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==============================
// Importing custom error handling utilities
// ==============================
const ExpressError = require("./utils/ExpressError.js");

// ==============================
// Method Override for PUT and DELETE requests
// ==============================
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// ==============================
// Require express session
// ==============================
const session = require("express-session");
// Require connect-mongo to store session in MongoDB
const MongoStore = require("connect-mongo");

// Store session in MongoDB to persist sessions
const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DB_URL,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto: {
    secret: process.env.SECRET,
  }
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

// Setting up session configuration
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week from now
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
    httpOnly: true, // Prevents client-side JS from accessing the cookie
  },
};


// Using session middleware
app.use(session(sessionOptions));

// ==============================
// Require connect-flash for flash messages
// ==============================
const flash = require("connect-flash");
app.use(flash());

// ==============================
// Initialize Passport and use session
// ==============================
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use LocalStrategy with User model's authenticate method
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));

// Serialize user instances to the session
passport.serializeUser(User.serializeUser());
// Deserialize user instances from the session
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB using Atlas connection string
const dbUrl = process.env.ATLAS_DB_URL;

// ==============================
// Function to connect to MongoDB
// ==============================
async function main() {
  await mongoose.connect(dbUrl);
}

// Connecting to MongoDB
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

  // ==============================
// Home Route
// ==============================
app.get("/", (req, res) => {
  res.render("listings/home");
});


// ==============================
// Middleware to set local variables for flash messages that are accessible in all templates but not in server side code
// ==============================
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // req.user is set by Passport
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ==============================
// Importing Routes
// ==============================
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const e = require("connect-flash");

// ==============================
// Using imported routes
// ==============================

// Using listing routes from routes/listing.js
// All routes in listingRoutes will be prefixed with /listings
app.use("/listings", listingRoutes);

// Using review routes from routes/review.js
// All routes in reviewRoutes will be prefixed with /listings/:id/reviews
app.use("/listings/:id/reviews", reviewRoutes);

// Using user routes from routes/user.js
// All routes in userRoutes will be prefixed with /users
app.use("/users", userRoutes);

// ==============================
// Starting the server
// ==============================
app.listen(port, () => {
  console.log(`Server is running on:http://localhost:${port}`);
});


// ==============================
// Handling favicon.ico requests
// ==============================
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ==============================
// Handling chrome well-known requests
// ==============================
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end(); // No content
});
// ==============================
// If request goes on other than these routes then
// ==============================
app.all(/^.*$/, (req, res, next) => {
  const err = new ExpressError("Page Not Found!", 404);
  next(err);
});

// ==============================
// Error Handling Middleware
// ==============================
app.use((err, req, res, next) => {
  if (!err.status) err.status = 500;
  if (!err.message) err.message = "Something went wrong";
  // res.status(status).send(message);
  console.log(err.message);
  res.status(err.status).render("error", { err });
});
