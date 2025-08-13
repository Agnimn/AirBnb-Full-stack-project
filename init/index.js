// const mongoose = require("mongoose");
// const listing = require("../models/listing.js");
// const initData=require("./data.js");

// main().then(() => {
//     console.log("Successfully connected");

// })
//     .catch(err => console.log(err));

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

// }

// const initDB= async()=>{
// await listing.deleteMany({});
// initData.data=initData.data.map((obj) => ({
//     ...obj,
//     owner:"67717c9e34073547bd39ae34",
// }));

// await listing.insertMany(initData.data);
// console.log("data was intialised");

// }

// initDB();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Successfully connected to MongoDB");
}

async function initDB() {
  try {
    // 1. Delete existing listings
    await Listing.deleteMany({});
    console.log("All old listings deleted");

    // 2. Use geometry from data.js directly
    const dataWithFixes = initData.data.map((obj) => ({
      ...obj,
      owner: "67717c9e34073547bd39ae34", // replace with your actual user ID
      geometry: obj.geometry || {
        type: "Point",
        coordinates: [obj.longitude, obj.latitude],
      },
    }));

    // 3. Insert into MongoDB
    await Listing.insertMany(dataWithFixes);
    console.log("Data was initialized successfully");
  } catch (err) {
    console.error("Error initializing data:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Connect first, then seed
main()
  .then(initDB)
  .catch((err) => console.error(err));
