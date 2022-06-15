const express = require("express");
const router = express.Router();
const fetchuser=require('../middleware/fetchuser')
const Products = require("../models/Products");
const Carts = require("../models/Cart");
const Address = require("../models/Address");

//TODO Add a product to cartList POST "/api/cart/addToCart" Login required

router.post("/addToCart",fetchuser,async(req,res)=>{
    try{
        const productId= req.header('productId')
        const t=await Carts.find({user:req.user.id,productId:productId})
        if(t.length==0){
            const toBeAdded=await Products.find({_id:productId})
            const {brand,title,image,category,description,price,count,rate}=toBeAdded[0];
            const temp=new Carts({user:req.user.id,productId,brand,title,image,category,description,price,count,rate,quantity:1,value:price})
            const cartItem=await temp.save() 
            
            const cartList=await Carts.find({user:req.user.id});
            let totalCart=0;
            cartList.map((product)=>{return totalCart=totalCart+product.value})

            const id = req.user.id;
            const cartI = await Carts.find({user:id});
            const cartCount=cartI.length       
            return res.json({cartItem:cartItem,totalCartValue:totalCart, cartCount});
        }else{
            return res.status(404).json("already present")
        }
    
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//TODO Update a product from cartList PUT "/api/cart/updateCart" Login required

router.put("/updateCart",fetchuser,async(req,res)=>{
    try{
        const productCartId=req.header("productCartId");
        const updatedN=req.header("updatedN");

        const updateProduct=await Carts.findById(productCartId);
        if(!updateProduct){
            return res.status(404).send("Product not found in cartlist")
        }
        if((req.user.id)!==(updateProduct.user.toString())){
            return res.status(401).send("Unauthorized access")
        }
        
        const updatedQuantity=Number(updateProduct.quantity) + (updatedN==='true'?1:-1);
        const v=(updateProduct.price)*updatedQuantity;
        const updated=await Carts.findByIdAndUpdate(productCartId,{$set:{quantity:updatedQuantity,value:v}}, {new:true})
       
        const cartList=await Carts.find({user:req.user.id}).sort({date:-1});
        let totalCart=0;
        cartList.map((product)=>{return totalCart=totalCart+product.value})

        res.json({success:true, totalCartValue:totalCart, subTotal:v });

    }catch{
        res.status(500).send("Internal server error occured.")
    }
})

//TODO Delete a product from cartList DELETE "/api/cart/removeFromCart" Login required

router.delete("/removeFromCart",fetchuser,async(req,res)=>{
    try{
        const productCartId= req.header('productCartId')
        const deleteProduct= await Carts.findById(productCartId)
        if(!deleteProduct){
            return res.status(404).send("Product not found in wishlist")
        }
        if((req.user.id)!==(deleteProduct.user.toString())){
            return res.status(401).send("Unauthorized access")
        }
        const deleteProducts=await Carts.findByIdAndDelete(productCartId)

        const cartList=await Carts.find({user:req.user.id});
        let totalCart=0;
        cartList.map((product)=>{return totalCart=totalCart+product.value})

        const id = req.user.id;
        const cartI = await Carts.find({user:id});
        const cartCount=cartI.length

        return res.status(200).json({"success":"Successfully deleted from server", totalCartValue:totalCart, cartCount})
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//TODO Get cartList of the user GET "/api/cart/getCart" Login required

router.get("/getCart",fetchuser,async(req,res)=>{
    try{
        const cartList=await Carts.find({user:req.user.id}).sort({date:-1});
        const addressPrimary=await Address.find({user:req.user.id, isPrimary:true});

        let totalCart=0;
        cartList.map((product)=>{return totalCart=totalCart+product.value})
        if(addressPrimary.length>0){
            res.json({totalCartValue:totalCart,addressPrimary:addressPrimary, cartList:cartList});
        }
        else{
            res.json({totalCartValue:totalCart,addressPrimary:false, cartList:cartList});
        }
    }catch{
        // console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

module.exports=router