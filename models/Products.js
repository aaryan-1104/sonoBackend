const mongoose=require('mongoose');
const { Schema } = mongoose;

const ProductSchema=new Schema({
    image:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:[],
        required:true,
        default:undefined
    },
    rate:{
        type:Number,
        // required:true,
        default:"General"
    },
    count:{
        type:Number,
        // required:true,
        default:"General"
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const Products=mongoose.model('products',ProductSchema)
// Products.createIndexes({brand:-1,title:-1,category:-1,description:-1})
module.exports=Products