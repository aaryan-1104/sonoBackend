const jwt=require('jsonwebtoken')

const "theuserisauthorized"="theuserisauthorized"

const fetchuser=(req,res,next)=>{
    //? fetch the token is exists from header or return error
    const token=req.header('auth-token');
    if(!token){
        return res.status(401).send({error:"Please authorize with valid token1"})
    }
    //? Verify the token if that is correct  and move to next function in "router.post" or not or return error
    try{
        const data=jwt.verify(token,"theuserisauthorized")
        req.user=data.user;
        next();
    }catch(error){
        return res.status(401).send({error:"Please authorize with valid token2"})
    }
}

module.exports=fetchuser 