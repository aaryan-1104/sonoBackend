const mongoose=require('mongoose');
const { Schema } = mongoose

const OrdersSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    paymentId:{
        type:String,
        required:true
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
    price:{
        type:Number,
        required:true,
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
    address:{
        type:String,
        required:true
    },
    shippingAddress:{
        type:String,
        required:true
    },
    recieptUrl:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }    
})

const orders=mongoose.model('orders',OrdersSchema)
module.exports=orders