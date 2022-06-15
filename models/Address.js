const mongoose=require('mongoose');
const { Schema } = mongoose;


const AddressSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    firstName:{
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    addressLine1:{
        type:String,
        required:true
    },
    addressLine2:{
        type:String,
    },
    pincode:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        required:true,
        type:String
    },
    country:{
        required:true,
        type:String
    },
    isPrimary:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const address = mongoose.model('addresses',AddressSchema);
module.exports=address
