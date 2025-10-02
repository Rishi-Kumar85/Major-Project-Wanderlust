const mongoose=require("mongoose");
const review = require("./review.js");

const listingSchema= new mongoose.Schema({

    title:{
        type:String,
        required: true,
    },
    description: {
        type: String,
    },
    image:{
       url: String,
       filename: String,
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates:{
            type: [Number],
            required: true,
        }
    },
    category:{
        type: String,
        enum: ['Beach', 'Mountain', 'City', 'Countryside', 'Desert', 'Forest', 'Island', 'Lake', 'River', 'Cultural', 'Adventure', 'Wildlife', 'Historical', 'Romantic', 'Family', 'Luxury', 'Budget'],
    }
});

listingSchema.post("findOneAndDelete", async function(listing){
    if(listing && listing.reviews.length){
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
