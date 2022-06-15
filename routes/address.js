const express = require("express");
const router = express.Router();
const fetchuser=require('../middleware/fetchuser');
const Address= require("../models/Address");

//TODO Add a product to cartList POST "/api/cart/addToCart" Login required

router.post("/addAddress",fetchuser,async(req,res)=>{
    try{
        // const productId= req.header('user')
            const {firstName,lastName,contactNumber,addressLine1,addressLine2,pincode,city,district,state,country}=req.body;
            const temp=new Address({user:req.user.id,firstName,lastName,contactNumber,addressLine1,addressLine2,pincode,city,district,state,country})
            const address=await temp.save()
            const addressList=await Address.find({user:req.user.id});
            const addressPrimary=await Address.find({user:req.user.id});
            return res.json({addressList:addressList, addressPrimary:addressPrimary});
    
    }catch{
        // console.error(error.msg);
        res.status(500).json({"error":"Internal server error occured"});
    }
})

router.put("/updateAddress",fetchuser,async(req,res)=>{
    try{
        const addressId=req.header("addressId");

        const updateAddress=await Address.findById(addressId);
        if(!updateAddress){
            return res.status(404).send("Product not found in wishlist")
        }
        if((req.user.id)!==(updateAddress.user.toString())){
            return res.status(401).send("Unauthorized access")
        }

        const {firstName,lastName,contactNumber,addressLine1,addressLine2,pincode,city,district,state,country}=req.body;
        const updated=await Address.findByIdAndUpdate(addressId,{$set:{firstName:firstName,lastName:lastName,contactNumber:contactNumber,addressLine1:addressLine1,addressLine2:addressLine2,pincode:pincode,city:city,district:district,state:state,country:country}}, {new:true})
       
        res.json({"success":true});

    }catch{
        res.status(500).json({"error":"Internal server error occured"})
    }
})

router.put("/setPrimary",fetchuser, async(req,res)=>{
    try{
        const addressId=req.header("addressId");
        const newPrimary=await Address.findById(addressId);
        const oldPrimary=await Address.find({user:req.user.id, isPrimary:true})
        if(oldPrimary.length>0){
            const oldPrimaryAddressId=oldPrimary[0].id;
            await Address.findByIdAndUpdate(oldPrimaryAddressId, {$set:{isPrimary:false}})
        }
        if(newPrimary){
            const address=await Address.findByIdAndUpdate(newPrimary.id, {$set:{isPrimary:true}},{new:true});
            return res.status(200).json({"success":true, primaryAddress:address})
        }
    }
    catch(err){
        return res.status(500).send("Internal server error occured"+" "+err);
    }
})

router.delete("/deleteAddress", fetchuser, async(req,res)=>{
    try{
        const addressId=req.header("addressId");
        const deleteAddress=await Address.findById(addressId);
        if(!deleteAddress){
            return res.status(404).send("Product not found in wishlist")
        }
        if((req.user.id)!==(deleteAddress.user.toString())){
            return res.status(401).send("Unauthorized access")
        }

        const tobeDeleted=await Address.findByIdAndDelete(addressId);
        
        res.json({"success":true});
    
    }catch{
        
        res.status(500).send("Internal server error occured");
    }
})

router.get("/getAddress",fetchuser,async(req,res)=>{
    try{
        // const productId= req.header('user')
            const pAddress=await Address.find({user:req.user.id, isPrimary:true});
            const address=await Address.find({user:req.user.id});
            return res.json({"success":true,"addressPrimary":pAddress,"address":address});
    
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

module.exports = router