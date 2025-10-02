const Listing = require('../models/listing.js');
const axios = require('axios');

// ==============================
// Listing Routes
// ==============================

// Listing Routes are now in controllers/listing.js
// This file is just a placeholder for all the functions related to listings.

// List all listings
module.exports.listings= async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/listings", { listings, showSearch:true });
};

// Render form to create a new listing
module.exports.renderNewForm= (req, res) => {
    res.render("listings/new");
};

// Show a specific listing
module.exports.showListing= async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if (!listing) {
       req.flash("error", "Listing not found!");
       return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
};

// Create a new listing
module.exports.createListing = async (req, res,next) => {
  try {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;

    if (typeof req.file === "undefined") {
      req.flash("error", "Image is required!");
      return res.redirect("/listings/new");
    }

    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };

    // 🌍 Geocode the location
    const fullAddress = `${newListing.location}, ${newListing.country}`;
    const apiKey = process.env.MAP_API_KEY;

    const geoRes = await axios.get('https://api.geoapify.com/v1/geocode/search', {
      params: {
        text: fullAddress,
        apiKey: apiKey
      }
    });

    const geoData = geoRes.data;
    if (geoData.features.length === 0) {
      req.flash("error", "Invalid location. Please enter a valid address.");
      return res.redirect("/listings/new");
    } 
    newListing.geometry = geoData.features[0].geometry;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

// Edit a listing
module.exports.renderEditForm =async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_300"); // Resize image to width of 300px

    res.render("listings/edit", { listing, originalImageUrl });
};

// Update a listing
module.exports.updateListing= async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
   let listing= await Listing.findByIdAndUpdate(id, {...updatedData}); // ... is a spread operator that expands the updatedData object into individual fields
   if(typeof req.file !== "undefined") { 
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
}
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
};

// Delete a listing
module.exports.deleteListing= async (req, res, next) => {
    const { id } = req.params;
     await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
};