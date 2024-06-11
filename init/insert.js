const mongoose = require('mongoose');
const data = require("./data.js");
const listing = require("../model/listing/listing");
main()
.then(()=>console.log("connected successfuly"))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}
const insert = async ()=>{
	const res = await listing.insertMany(data);
	console.log(res)
}

insert();