const mongoose = require("mongoose");
const {data} = require("./data.js");
const Listing = require("../model/listing/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/book";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
           await Listing.insertMany(data);

};

initDB();

 