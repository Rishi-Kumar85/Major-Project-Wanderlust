const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

// Functionality of all routes of review routes

// Post a review
module.exports.postReview = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        throw new ExpressError("Listing not found!", 404);
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Created new review!");
    res.redirect(`/listings/${id}`);
};

// Delete a review
module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
if (!listing) {
    throw new ExpressError("Listing not found", 404);
}
await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
await Review.findByIdAndDelete(reviewId);
req.flash("success", "Successfully deleted review!");
res.redirect(`/listings/${id}`);
};