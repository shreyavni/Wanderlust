const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const MONGO_URL = process.env.ATLAS_DB || 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL, { family: 4 });
    console.log('db connected for initialization');
}

const User = require('../models/user.js');

const initDB = async()=>{
    await Listing.deleteMany({});
    
    const user = await User.findOne({});
    if (!user) {
        console.log("Please register a user on the website before running this script!");
        return;
    }

    initData.data =initData.data.map((obj)=>
        ({ ...obj, owner: user._id }));
        
    await Listing.insertMany(initData.data);
    console.log("data was initialized with owner: " + user.username);
}

main()
    .then(() => initDB())
    .catch((err) => console.log(err));