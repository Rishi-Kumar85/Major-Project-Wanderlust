// Requiring express
const express = require("express");
// require express router and create a router instance
// This allows us to define routes in this file
const router = express.Router();

//Requiring multer for file uploads
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Requiring necessary modules and models
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");


// router.route("/") for all req on "/" route

router
  .route("/")
  // Listings Route
  .get(wrapAsync(listingController.listings))
  // Create Listing Route
  .post(isLoggedIn,upload.single('image'), wrapAsync(listingController.createListing));
  

// New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
// Show Route 
  .get(wrapAsync(listingController.showListing))
// Update Listing Route
  .put(isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
// Delete Listing Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


// Edit Listing Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// Exporting the router
module.exports = router;