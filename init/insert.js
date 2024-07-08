const mongoose = require('mongoose');
let data = require("./data.js");
const listing = require("../model/listing/listing");
main()
.then(()=>console.log("connected successfuly"))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/book');
}
const insert = async ()=>{
	await listing.findByIdAndDelete("66855572b5d2bfb48b217b19");
 // data = data.map((obj) => ({
 //  ...obj,owner: '6683f3e3ec377fbf54e387e2',}));	
 //  const res = await listing.insertMany(data);
	console.log("jbjk")
}

insert();