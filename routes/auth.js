const express = require("express");
const router = express.Router();

const User = require("../models/User");

const Carts = require("../models/Cart")

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const JWT_SECRET=process.env.JWT_SECRET;

const fetchuser=require('../middleware/fetchuser')

//todo Create a user using: POST "/api/auth/createUser"
router.post(
  "/createUser",
  //* Validation rules which will be checked in user request data
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],

  async (req, res) => {
    // console.log(req.body);
    let success=false

    //! Returns error if validation conditions failed 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

      //? If the user already exists return a error message with 400 code
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User already exists with this Email Id" });
      }

      const salt = await bcrypt.genSalt(10) //*Genarating salt

      //* Hashing the password which will be stored in database and adding salt to it
      const secPassword = await bcrypt.hash(req.body.password, salt);
      
      //todo Creating the user in database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      //   .then(user => res.json(user))
      //   .catch(err => {console.log(err)
      //   res.json({error:"User already exists with this Email Id "})
      //     })

      //* Creating a token which will be returned after authentication or after creating new user
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success,authToken});

      //! Return error message with internal error code(500)
    } catch (error) {
      console.error(error.msg);
      res.status(500).send("Internal server error occured");
    }
    // const user=User(req.body)
    // user.save();
    // res.send(req.body);
  }
);

//todo Authentication of user using :POST "/api/auth/login"
router.post(
    "/login",
    //* Validation rules which will be checked in user request data
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password", "Password required").exists()
    ],
    async (req,res)=>{
    let success=false

    //! Returns error if validation conditions failed 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password}=req.body;
    try {
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json("Please try to login with correct credential")
        }

        const comparePassword=await bcrypt.compare(password, user.password);

        if(!comparePassword){
            return res.status(400).json("Please try to login with correct credential")
        }

        const data = {
            user: {
              id: user.id,
            },
        };
        const authToken = jwt.sign(data, JWT_SECRET,{expiresIn:"7d"});
        const username=user.name;
        success=true
        const id = user.id;
        const cartI = await Carts.find({user:id});
        const cartCount=cartI.length

        res.json({success,authToken,username, cartCount});

        } catch (error) {
        console.error(error.msg);
        res.status(500).send("Internal server error occured");
      }

    }
)

//todo Get details of user using :POST "/api/auth/getUser" Login required
router.post('/getuser',fetchuser,async (req,res)=>{
  try{
    userId=req.user.id;
    const user=await User.findById(userId).select('-password')
    res.send(user)
  }catch(error){
    console.error(error.message)
    res.status(500).send({error:"Internal Server Error"})
  }
})

module.exports = router;
