const mongoose = require("mongoose");
const initData = require("../init/data.js");

const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    // Add owner to each listing
    initData.data= initData.data.map(listing => ({
        ...listing,
        owner: "68dabda6b88f2c137ef27801" // Replace with a valid user ID from your database
    }));
    await Listing.insertMany(initData.data);
    console.log("Database Initialized with Sample Data");
};

initDB();
