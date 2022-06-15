const express = require("express");
const router = express.Router();
// const fetchuser=require('../middleware/fetchuser');
const Products = require("../models/Products");

//todo Add a new Product: POST "/api/shop/addProduct" Login required
router.post('/addProduct',async (req, res)=>{
    try{
        // console.log("Entered")
        const {image,brand,title,category,description,price,count,rate}=req.body
        const temp=new Products({image:image,brand,title,description,category,price,rate,count})
        const product=await temp.save()
        res.json(product);
        // console.log("Successfully saved in database")
    
    //! Return error message with internal error code(500)
    } catch (error) {
        console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//todo Get All Products of user using: GET "/api/auth/getAllProducts" Login required
router.get('/getAllProducts', async (req, res)=>{
    try{
        const c= req.header('category')
        const products=await Products.find({category:c})
        res.json(products);

    //! Return error message with internal error code(500)
    } catch (error) {
        console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

//todo Get All Products based upon the filtering condition provided by user using: GET "/api/auth/getAllProducts" Login required
router.post('/getAllProducts/filter', async (req, res)=>{
    try{
        const { category, brand }= req.body
        if(category && brand){
            const products=await Products.find({category:[category[0],category[1]], brand:brand})
            res.json(products);
        }
        else if(category){
            const products=await Products.find({$or:[{category:[category[0],category[1]]}, {category:[category[0],"unisex"]}]})
            res.json(products);
        }
        else{
            const products=await Products.find({brand:brand})
            res.json(products);
        }

    //! Return error message with internal error code(500)
    } catch (error) {
        console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})

router.get('/getProduct', async (req, res)=>{
    try{
        const productId= req.header('productId')
        const product=await Products.find({_id:productId})
        res.json(product);

    //! Return error message with internal error code(500)
    } catch (error) {
        console.error(error.msg);
        res.status(500).send("Internal server error occured");
    }
})


router.get('/searchProducts',async(req,res)=>{
    try{
        const query=req.header('searchString');
        const product = await Products.find({ $or:[{brand: new RegExp(query,'i') }, { category: new RegExp(query,'i') }, { title: new RegExp(query,'i') }, { description: new RegExp(query,'i') }] })
        return res.status(200).json(product)
    }
    catch(err){
        return res.status(500).send(err);
    }
})

module.exports=router