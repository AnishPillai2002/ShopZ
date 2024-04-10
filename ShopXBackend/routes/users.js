//api for user authentication

const express = require('express');
const router = express.Router();
require('dotenv/config'); //used to access environment variables
const User = require('../models/user');
var bcrypt = require('bcryptjs'); //used to hash password for security purpose
const jwt = require('jsonwebtoken'); //used to generate token for user authentication

//JWT Token  is a standard way to securely send information between two parties 
//as a JSON object. JWTs are often used for authentication and authorization, 
//and are a popular way to authenticate users in a microservice architecture.



//GET request for Getting all the User
router.get(`/`, async(req, res) => {
    //find() is a promise so we use then and catch/ or we can also use async await
    const userList=await User.find().select('-passwordHash');//select is used to exclude passwordHash from response
    //if productList is empty
    if(!userList){
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    }
    res.send(userList); //sending categoryList as response
});



//GET request for Single User by id
router.get('/:id',(req,res)=>{
     User.findById(req.params.id).select('-passwordHash').then((data)=>{ //select is used to exclude passwordHash from response
        if(data){
            return res.status(200).json(data); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'User not found'}); //404 is status code for not found
        }
    }).catch((err)=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    }); //finding category by id
});



//POST request for Admin Registration
router.post(`/`, (req, res) => {
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    });
    //saving user to database
    user.save().then((createdUser)=>{
        res.status(201).json(createdUser); //201 is status code for created
    }).catch((err)=>{
        res.status(500).send('User Cannot be Created');//500 is status code for internal server error
    });
});



//POST request for User Registration   (Public API)
router.post(`/register`, (req, res) => {
    let user=new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.password,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    });
    //saving user to database
    user.save().then((createdUser)=>{
        res.status(201).json(createdUser); //201 is status code for created
    }).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        });//500 is status code for internal server error
    });
});



//POST request to Login   (Public API)
router.post('/login',async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    const secret=process.env.secret;
    if(!user){
        return res.status(404).send('User not found');
    }
    //compare password with hashed password
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){    
        //generate JWT token for user authentication
        const token=jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin //if user is admin then isAdmin will be true
            },
            secret,
            {expiresIn:'1d'} //token will expire in 1 day, the app will logout the user after 1 day
        );
        return res.send({user:user.email,token:token,message:'User authenticated'});
    }else{
        return res.status(400).send('Password is wrong');
    }

});



//DELETE request for User
router.delete('/:id',(req,res)=>{
    //deleting user by id
    const user= User.findByIdAndDelete(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,message:'The User is deleted!'}); //200 is status code for ok
        }else{
            return res.status(404).json({success:false,message:'User not found'}); //404 is status code for not found
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err}); //400 is status code for bad request
    });
});



//API to get the Count of Users
router.get(`/get/count`,(req,res)=>{
    //counting the number of products
    User.countDocuments().then(count=>{
        res.send({
            UserCount:count
        });
    }).catch(err=>{
        res.status(500).json({  //500 is status code for internal server error
            success:false
        });
    });
});



//exporting the router
module.exports = router; //exporting the router