const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const {reviewSchema} = require("./schema");
const Review = require("./models/review");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/users/login");
  }
  next();
};

// Middleware to save the returnTo URL in res.locals for use after login
module.exports.saveReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
    next();
};


// IsOwner middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You do not have permission to edit this listing!");
      return res.redirect(`/listings/${id}`);
    }
  next();
};

// Validate Listing middleware
module.exports.validateListing = (req, res, next) => {
     if (!req.body || Object.keys(req.body).length === 0) {
        throw new ExpressError("Invalid Listing Data!", 400);
    }
    const { error } = listingSchema.validate(req.body);
    if (error) {
       throw new ExpressError(error, 400);
    }
    next();
};

// Validate Review middleware
module.exports.validateReview = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ExpressError("Invalid Review Data", 400);
    }
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(error, 400);
    }
    next();
};


// Review Author middleware to check if the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};