const express = require("express");
const router = express.Router();
const fetchuser=require('../middleware/fetchuser')
const Products = require("../models/Products");
const Carts = require("../models/Cart");
const Address = require("../models/Address");
const YourOrders= require("../models/YourOrders");

router.post('/addOrder',fetchuser,async(req,res)=>{

    try{
        const {paymentId, address, shippingAddress, recieptUrl}=req.body;

        const cartList=await Carts.find({user:req.user.id});
        let totalCart=0;
        cartList.map((product)=>{return totalCart=totalCart+product.value});

        for(let i=0;i<cartList.length;i++){
            const {productId,brand,title,image,price,quantity,value}=cartList[i];
            const temp=new YourOrders({user:req.user.id,productId,paymentId,title,brand,image,price,quantity,value,address,shippingAddress,recieptUrl})
            await temp.save() 
        }

        const updatedOrders= await YourOrders.find({user:req.user.id}).sort({date:-1})
        await Carts.deleteMany({user:req.user.id})
        return res.status(200).json(updatedOrders);

    }catch(err){
        return res.status(500).send(err); 
    }
})

router.get('/getOrders',fetchuser,async(req,res)=>{
    try{
        // console.log("Get Your Order List")
        const yourOrders= await YourOrders.find({user:req.user.id}).sort({date:-1});

        return res.status(200).json(yourOrders);

    }catch(err){
        return res.status(500).send(err);
    }
})

module.exports=router
