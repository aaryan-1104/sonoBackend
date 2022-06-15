const mongoose=require('mongoose');
const { Schema } = mongoose;

const WishlistSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    brand:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    image:{
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
        default:"General"
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
const wishlist=mongoose.model('wishlist',WishlistSchema)
module.exports=wishlist