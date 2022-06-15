const express = require("express");
const router = express.Router();
const fetchuser=require('../middleware/fetchuser');
const Wishlist = require("../models/Wishlist");
const Products = require("../models/Products");


//TODO Add a product to wishList POST "/api/wishlist/addToWishlist" Login required

router.post("/addToWishlist",fetchuser,async(req,res)=>{
    try{
        const productId= req.header('productId')
        const t=await Wishlist.find({user:req.user.id,productId:productId})
        if(t.length==0){
            const toBeAdded=await Products.find({_id:productId})
            const {brand,title,image,category,description,price,count,rate}=toBeAdded[0];
            const temp=new Wishlist({user:req.user.id,productId,brand,title,image,category,description,price,count,rate})
            const wishItem=await temp.save()    
            return res.json(wishItem);
        }else{
            res.json("already present")
        }
    
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//TODO Delete a product from wishList DELETE "/api/wishlist/removeFromWishlist" Login required

router.delete("/removeFromWishlist",fetchuser,async(req,res)=>{
    try{
        const productWishId= req.header('productWishId')
        const deleteProduct= await Wishlist.findById(productWishId)
        if(!deleteProduct){
            return res.status(404).send("Product not found in wishlist")
        }
        if((req.user.id)!==(deleteProduct.user.toString())){
            return res.status(401).send("Unauthorized access")
        }
        const deleteProducts=await Wishlist.findByIdAndDelete(productWishId)
        return res.json(deleteProducts)
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//TODO Get wishList of the user GET "/api/wishlist/getWishlist" Login required

router.get("/getWishlist",fetchuser,async(req,res)=>{
    try{
        const wishList=await Wishlist.find({user:req.user.id}).sort({date:-1});
        res.json(wishList);
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

module.exports=router
