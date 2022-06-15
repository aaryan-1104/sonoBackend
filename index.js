const connectToMongo=require("./database");
const express = require('express');
connectToMongo(); 

const app = express()
var cors=require('cors')

const dotenv=require("dotenv")
dotenv.config();
const port = process.env.PORT

app.use(cors())
app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/shop', require('./routes/products'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/address', require('./routes/address'))
app.use('/api/checkout', require('./routes/stripe'))
app.use('/api/orders',require('./routes/orders'))


app.get('/',(req,res)=>{
    obj={
        name:'Aryan',
        number:49
    }
    res.json(obj)
})


app.listen(port || 5000, () => {
  console.log(`Sono listening at http://localhost:${port}`)
})