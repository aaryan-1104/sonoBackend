const mongoose=require('mongoose');
// const {MongoClient} = require('mongodb');
const dotenv=require("dotenv")
dotenv.config();

const mongooseURI=process.env.MONGO_URL
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