const mongoose=require('mongoose');
const { Schema } = mongoose;

const CartSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    title:{
        type:String,
        required:true
    },
    brand:{
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
    quantity:{
        type:Number,
        default:1,
        min:1
    },
    value:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const cart=mongoose.model('carts',CartSchema)
module.exports=cart