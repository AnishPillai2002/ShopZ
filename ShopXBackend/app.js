const express = require('express'); //used to create server
const bodyParser=require('body-parser'); //used to parse request body to json
const app = express(); //creating server
const morgan = require('morgan');   // used to log request details
const mongoose=require('mongoose'); //used to connect to mongodb
const cors=require('cors'); //used to enable cross origin resource sharing
require('dotenv/config'); //used to access environment variables

const authJwt = require('./helpers/jwt'); //used to protect the api routes from unauthorized access

const errorHandler = require('./helpers/errorhandler'); //used to handle errors

app.use(cors()); //enabling cors
app.options('*',cors()); //enabling cors options

//importing routes
const productRouter=require('./routes/products'); //importing product router
const categoryRouter=require('./routes/categories'); //importing category router
const userRouter=require('./routes/users'); //importing user router


//api
const api=process.env.API_URL;



//middleware
app.use(authJwt()); //using authJwt middleware to protect api routes

app.use(errorHandler); //using errorHandler middleware to handle errors


app.use(bodyParser.json()); //bodyparser is used to parse request body to json
app.use(morgan('tiny')); //morgan is used to log request details

app.use(`${api}/products`,productRouter); //using product router
app.use(`${api}/categories`,categoryRouter); //using category router
app.use(`${api}/users`,userRouter); //using user router





   

//connecting to mongodb
mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
    console.log('database connection is ready');
}).catch((err)=>{
    console.log(err);
})

//server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

