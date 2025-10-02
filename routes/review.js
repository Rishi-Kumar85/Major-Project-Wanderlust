const express = require("express");
const router = express.Router({ mergeParams: true }); // To access params from parent router

// Requiring necessary modules and models
const wrapAsync = require("../utils/wrapAsync.js");
const{validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");

const reviewController=require("../controllers/review.js");

// Post Review Routes
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));


// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
