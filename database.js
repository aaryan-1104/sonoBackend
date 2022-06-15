const mongoose=require('mongoose');
// const {MongoClient} = require('mongodb');
// const dotenv=require("dotenv")
// dotenv.config();

const mongooseURI="mongodb+srv://dev-admin-sono:x25d4HO09TmtzBhW@cluster0.3kzve.mongodb.net/sono?authSource=admin&replicaSet=atlas-kb93z2-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
// const client = new MongoClient(mongooseURI);
const connectToMongo=()=>{
    mongoose.connect(mongooseURI,{ useNewUrlParser: true, useUnifiedTopology: true },
        function (err, res) {
            try {
                console.log('Connected to Database');
            } catch (err) {
                throw err;
            }
    })
}

module.exports=connectToMongo;