const connectToMongo=require("./database");
const express = require('express');
var cors=require('cors')
connectToMongo(); 

const app = express()

const dotenv=require("dotenv")
dotenv.config();
const port = 5000

app.use(cors())
app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/shop', require('./routes/products'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/address', require('./routes/address'))
app.use('/api/checkout', require('./routes/stripe'))
app.use('/api/orders',require('./routes/orders'))

app.listen(process.env.PORT || 5000, () => {
  console.log(`Sono listening at http://localhost:${port}`)
})